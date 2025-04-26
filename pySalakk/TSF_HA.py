import streamlit as st
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf
import matplotlib.pyplot as plt
from datasets import load_dataset

# Set Streamlit page config
st.set_page_config(page_title="Salakk", page_icon="🔮")
st.title("Salakk")

# Step 1: Choose Data Source
dataset_options = {
    "Upload my own CSV": None,
    "Store Sales Time Series (t4tiana) - Train Split": "t4tiana/store-sales-time-series-forecasting",
    "Video Games Sales (JuanjoJ55)": "JuanjoJ55/video-games-sales",
}

choice = st.selectbox("Choose your data source:", list(dataset_options.keys()))

df = None
# Step 2: Load Data
if choice == "Upload my own CSV":
    uploaded_file = st.file_uploader("Upload a CSV file", type=["csv"])
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
    else:
        st.info("👆 Please upload a CSV file to proceed.")
        st.stop()
elif choice == "Store Sales Time Series (t4tiana) - Train Split":
    dataset_name = dataset_options[choice]
    with st.spinner(f"Loading {choice}..."):
        dataset = load_dataset(dataset_name, split="train")
        df = dataset.to_pandas()
    st.success(f"✅ Loaded {choice} from Hugging Face!")
elif choice == "Video Games Sales (JuanjoJ55)":
    dataset_name = dataset_options[choice]
    with st.spinner(f"Loading {choice}..."):
        dataset = load_dataset(dataset_name, split="train")
        df = dataset.to_pandas()
    st.success(f"✅ Loaded {choice} from Hugging Face!")

# Step 3: Preview the DataFrame
if df is not None:
    st.write("### Preview of your data:")
    st.dataframe(df)


if df is not None:
    columns = df.columns.tolist()

    st.write("Please select the date column in the CSV")
    date_column = st.selectbox("Select the date column", columns)

    st.write("Select numeric column to forecast")
    selected_trans_column = st.selectbox("Please select here", columns)

    st.write("Select store/product (or combo) to forecast")
    selected_forecast_columns = st.multiselect("Please pick them here", columns)

    if selected_forecast_columns:
        unique_combos = df[selected_forecast_columns].drop_duplicates()
        unique_combos["label"] = unique_combos.astype(str).agg(" | ".join, axis=1)
        sorted_labels = sorted(unique_combos["label"].tolist())
        selected_combo_label = st.selectbox("Select a specific combination to forecast", sorted_labels)
        selected_combo_row = unique_combos[unique_combos["label"] == selected_combo_label].iloc[0]
        selected_combo_dict = {col: selected_combo_row[col] for col in selected_forecast_columns}
        for col, val in selected_combo_dict.items():
            df = df[df[col] == val]
        st.success(f"🔍 Filtering data for: {selected_combo_label}")

    granularity = None

    if selected_forecast_columns:
        # Try to parse the date_column intelligently
        date_formats = ["%Y-%m-%d", "%Y-%m", "%Y"]
        parsed_successfully = False
        used_format = None

        for fmt in date_formats:
            try:
                df[date_column] = pd.to_datetime(df[date_column], format=fmt)
                parsed_successfully = True
                used_format = fmt
                break
            except Exception:
                continue

        if not parsed_successfully:
            st.error("❌ Could not parse date column. Please ensure it's in YYYY-MM-DD, YYYY-MM, or YYYY format.")
            st.stop()

        # Extract date components based on format
        df["Year"] = df[date_column].dt.year

        if used_format in ["%Y-%m", "%Y-%m-%d"]:
            df["Month"] = df[date_column].dt.month
            df["MonthStr"] = df[date_column].dt.strftime('%Y-%m')
        else:
            df["Month"] = None
            df["MonthStr"] = None

        if used_format == "%Y-%m-%d":
            df["Day"] = df[date_column].dt.day
            df["Date"] = df[date_column].dt.date
        else:
            df["Day"] = None
            df["Date"] = None

        # Safely create DateFull
        df["DateFull"] = pd.to_datetime(df[["Year", "Month", "Day"]], errors='coerce')

        # Drop rows where transaction column is missing
        df.dropna(subset=[selected_trans_column], inplace=True)

        # Detect available granularities
        available_granularities = ["Year"]
        if used_format in ["%Y-%m", "%Y-%m-%d"]:
            available_granularities.append("Month")
        if used_format == "%Y-%m-%d":
            available_granularities.append("Date")

        if len(available_granularities) == 1:
            granularity = "Year"
            st.info("📌 Only year-level dates detected. Forecasting limited to yearly granularity.")
        else:
            st.write("Forecast at what level?")
            granularity = st.radio("Forecast at what level?", available_granularities)

        # -------------------------- YEARLY AGGREGATION --------------------------
        if granularity == "Year":
            years_available = sorted(df["Year"].unique())
            selected_min_year = st.selectbox("Select Min Year", years_available)
            selected_max_year = st.selectbox("Select Max Year", years_available[::-1])

            df = df[(df["Year"] >= selected_min_year) & (df["Year"] <= selected_max_year)]
            group_cols = selected_forecast_columns + ["Year"]
            agg_df = df.groupby(group_cols)[selected_trans_column].sum().reset_index()

            st.write("🔢 Aggregated Year-wise Data")
            st.dataframe(agg_df)

        # -------------------------- MONTHLY AGGREGATION --------------------------
        elif granularity == "Month":
            month_type = st.radio("Monthly aggregation:", ["Same value over years", "All values over years"])
            all_months = sorted(df["Month"].dropna().unique())
            all_years = sorted(df["Year"].unique())

            selected_month = st.selectbox("Pick a month (1-12)", all_months)
            selected_min_year = st.selectbox("Select Min Year", all_years)
            selected_max_year = st.selectbox("Select Max Year", all_years[::-1])

            df = df[(df["Year"] >= selected_min_year) & (df["Year"] <= selected_max_year)]

            if month_type == "Same value over years":
                full_range = pd.DataFrame({"Year": all_years, "Month": selected_month})
                temp_df = df[df["Month"] == selected_month]
                agg_df = temp_df.groupby(selected_forecast_columns + ["Year", "Month"])[selected_trans_column].sum().reset_index()
                agg_df = pd.merge(full_range, agg_df, on=["Year", "Month"], how="left").fillna(0)
            else:
                agg_df = df.groupby(selected_forecast_columns + ["Year", "Month"])[selected_trans_column].sum().reset_index()

            st.write("📆 Aggregated Month Data")
            st.dataframe(agg_df)

        # -------------------------- DAILY AGGREGATION --------------------------
        elif granularity == "Date":
            date_type = st.radio("Daily aggregation:", ["Same value over years", "All values over years"])
            all_days = sorted(df["Day"].dropna().unique())
            all_months = sorted(df["Month"].dropna().unique())
            all_years = sorted(df["Year"].unique())

            selected_day = st.selectbox("Select Day", all_days)
            selected_month = st.selectbox("Select Month", all_months)
            selected_min_year = st.selectbox("Select Min Year", all_years)
            selected_max_year = st.selectbox("Select Max Year", all_years[::-1])

            df = df[(df["Year"] >= selected_min_year) & (df["Year"] <= selected_max_year)]

            if date_type == "Same value over years":
                full_range = pd.DataFrame({"Year": all_years, "Month": selected_month, "Day": selected_day})
                temp_df = df[(df["Month"] == selected_month) & (df["Day"] == selected_day)]
                agg_df = temp_df.groupby(selected_forecast_columns + ["Year", "Month", "Day"])[selected_trans_column].sum().reset_index()
                agg_df = pd.merge(full_range, agg_df, on=["Year", "Month", "Day"], how="left").fillna(0)
            else:
                agg_df = df.groupby(selected_forecast_columns + ["Year", "Month", "Day"])[selected_trans_column].sum().reset_index()

            st.write("📅 Aggregated Day Data")
            st.dataframe(agg_df)



        st.write("Select forecasting method")
        forecast_method = st.selectbox("Choose forecast model:", ["naive", "mid", "ETS", "ARIMA"])
        forecast_count = st.number_input("Number of future values to forecast", min_value=1, max_value=60, value=3)

        series = agg_df[selected_trans_column]

        if forecast_method == "mid" and granularity == "Year":
            st.warning("❌ 'mid' method cannot be applied at Year granularity.")
        else:
            if len(series) == 0 or np.all(pd.isnull(series)):
                st.error("Empty or invalid data for forecasting.")
            else:
                if forecast_method == "naive":
                    q1 = series.quantile(0.25)
                    q3 = series.quantile(0.75)
                    iqr = q3 - q1
                    filtered_series = series[(series >= q1 - 1.5 * iqr) & (series <= q3 + 1.5 * iqr)]
                    mean_val = filtered_series.mean()
                    forecast_values = [mean_val] * forecast_count

                elif forecast_method == "mid":
                    if granularity == "Month":
                        last_row = agg_df.iloc[-1]
                        base_year = last_row["Year"]
                        base_month = last_row["Month"]
                        values = []
                        for i in range(forecast_count):
                            similar = agg_df[agg_df["Month"] == base_month]
                            q1 = similar[selected_trans_column].quantile(0.25)
                            q3 = similar[selected_trans_column].quantile(0.75)
                            iqr = q3 - q1
                            filtered = similar[(similar[selected_trans_column] >= q1 - 1.5 * iqr) & (similar[selected_trans_column] <= q3 + 1.5 * iqr)]
                            mean_val = filtered[selected_trans_column].mean()
                            values.append(mean_val)
                        forecast_values = values

                    elif granularity == "Date":
                        last_row = agg_df.iloc[-1]
                        base_year = last_row["Year"]
                        base_month = last_row["Month"]
                        base_day = last_row["Day"]
                        values = []
                        for i in range(forecast_count):
                            similar = agg_df[(agg_df["Month"] == base_month) & (agg_df["Day"] == base_day)]
                            q1 = similar[selected_trans_column].quantile(0.25)
                            q3 = similar[selected_trans_column].quantile(0.75)
                            iqr = q3 - q1
                            filtered = similar[(similar[selected_trans_column] >= q1 - 1.5 * iqr) & (similar[selected_trans_column] <= q3 + 1.5 * iqr)]
                            mean_val = filtered[selected_trans_column].mean()
                            values.append(mean_val)
                        forecast_values = values

                elif forecast_method == "ETS":
                    if len(series.dropna()) == 0:
                        st.error("No valid data for ETS.")
                    else:
                        acf_vals = acf(series.dropna(), fft=False)
                        if max(acf_vals[1:]) > 0.5:
                            st.info("Seasonality detected. ETS is suitable.")
                        model = ExponentialSmoothing(series, trend='add', seasonal=None)
                        fit = model.fit()
                        forecast_values = fit.forecast(forecast_count)

                elif forecast_method == "ARIMA":
                    if len(series.dropna()) == 0:
                        st.error("No valid data for ARIMA.")
                    else:
                        try:
                            stat_test = adfuller(series.dropna())
                            if stat_test[1] < 0.05:
                                st.info("Data is stationary. ARIMA is suitable.")
                                model = ARIMA(series, order=(1,0,0))
                                fit = model.fit()
                                forecast_values = fit.forecast(steps=forecast_count)
                            else:
                                st.warning("Series not stationary. Try differencing or ETS.")
                                forecast_values = [series.mean()] * forecast_count
                        except ValueError:
                            st.error("ADF Test could not be performed on empty or constant series.")

                forecast_values = list(forecast_values)
                last_date = df[date_column].max()
                future_dates = pd.date_range(start=last_date, periods=forecast_count + 1, freq='Y')[1:]
                # Get unique values for the selected forecast columns (assumes one unique combo, as expected post-filtering)
                unique_values = agg_df[selected_forecast_columns].iloc[0]

                # Build forecast_df with identifier columns, future dates, and forecast values
                forecast_df = pd.DataFrame({
                    col: [unique_values[col]] * len(future_dates) for col in selected_forecast_columns
                })
                forecast_df["ds"] = future_dates
                forecast_df[selected_trans_column] = forecast_values

               # Update: Remove separate 'Date' column and extract Year, Month, and Day for concat
                forecast_df['Year'] = forecast_df['ds'].dt.year
                forecast_df['Month'] = forecast_df['ds'].dt.month
                forecast_df['Day'] = forecast_df['ds'].dt.day

                # Adjust 'forecast_df' to match 'agg_df' structure before concatenation
                forecast_values = forecast_df[selected_trans_column]
                agg_df_copy = agg_df.copy()

                # Determine which date parts to include based on agg_df_copy columns
                date_cols = ['Year']
                if 'Month' in agg_df_copy.columns:
                    date_cols.append('Month')
                if 'Day' in agg_df_copy.columns:
                    date_cols.append('Day')

                # Concatenate using only the relevant date columns
                full_df = pd.concat([
                    agg_df_copy,
                    forecast_df[selected_forecast_columns + date_cols + [selected_trans_column]]
                ], ignore_index=True)


                st.write("📊 Aggregated Data with Forecasted Values", full_df)

                # Updated: Adjust colors for graph based on forecast values
                colors = ['green' if v > series.iloc[-1] else 'red' for v in forecast_values]

                fig, ax = plt.subplots()

                if granularity == "Year":
                    x_vals = agg_df["Year"]
                    forecast_x_vals = forecast_df["ds"].dt.year
                    ax.set_xlabel("Year")
                    ax.set_xticks(sorted(list(set(x_vals.tolist() + forecast_x_vals.tolist()))))
                    ax.set_xticklabels([str(y) for y in sorted(list(set(x_vals.tolist() + forecast_x_vals.tolist())))])

                elif granularity == "Month":
                    x_vals = pd.to_datetime(agg_df["Year"].astype(str) + '-' + agg_df["Month"].astype(str).str.zfill(2))
                    forecast_x_vals = pd.to_datetime(forecast_df["ds"].dt.strftime('%Y-%m'))
                    ax.set_xlabel("Month")
                    ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter('%b %Y'))  # E.g., Jan 2018

                elif granularity == "Date":
                    x_vals = pd.to_datetime(
                        agg_df["Year"].astype(str) + '-' +
                        agg_df["Month"].astype(str).str.zfill(2) + '-' +
                        agg_df["Day"].astype(str).str.zfill(2)
                    )
                    forecast_x_vals = forecast_df["ds"]
                    ax.set_xlabel("Date")
                    ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter('%d %b %Y'))  # E.g., 15 Jan 2018

                # ⚡ Now loop through each category
                if selected_forecast_columns:
                    categories = agg_df[selected_forecast_columns[0]].unique()
                else:
                    categories = [None]

                for idx, cat in enumerate(categories):
                    if cat is not None:
                        cat_agg_df = agg_df[agg_df[selected_forecast_columns[0]] == cat]
                        cat_forecast_df = forecast_df[forecast_df[selected_forecast_columns[0]] == cat]
                    else:
                        cat_agg_df = agg_df
                        cat_forecast_df = forecast_df

                    # Handle x values again based on granularity
                    if granularity == "Year":
                        cat_x_vals = cat_agg_df["Year"]
                        cat_forecast_x_vals = cat_forecast_df["ds"].dt.year
                    elif granularity == "Month":
                        cat_x_vals = pd.to_datetime(cat_agg_df["Year"].astype(str) + '-' + cat_agg_df["Month"].astype(str).str.zfill(2))
                        cat_forecast_x_vals = pd.to_datetime(cat_forecast_df["ds"].dt.strftime('%Y-%m'))
                    elif granularity == "Date":
                        cat_x_vals = pd.to_datetime(
                            cat_agg_df["Year"].astype(str) + '-' +
                            cat_agg_df["Month"].astype(str).str.zfill(2) + '-' +
                            cat_agg_df["Day"].astype(str).str.zfill(2)
                        )
                        cat_forecast_x_vals = cat_forecast_df["ds"]

                    # Plot original and forecast
                    ax.plot(cat_x_vals, cat_agg_df[selected_trans_column], label=f"{cat} - Original", linestyle='-')
                    ax.plot(cat_forecast_x_vals, cat_forecast_df[selected_trans_column], label=f"{cat} - Forecast", linestyle='--', marker='x')

                # 🎨 Final beautification
                ax.set_ylabel(selected_trans_column)
                ax.legend()
                fig.autofmt_xdate()
                st.pyplot(fig)

else:
    st.warning("Please pick atleast one option and complete that.")