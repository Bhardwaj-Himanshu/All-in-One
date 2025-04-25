import streamlit as st
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf
import matplotlib.pyplot as plt

st.set_page_config(page_title="Salakk", page_icon="🔮")
st.title("Salakk")

# Step 1: Upload CSV
uploaded_file = st.file_uploader("Upload a CSV file", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    st.write("DataFrame preview:", df.head())

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
        df[date_column] = pd.to_datetime(df[date_column])
        df["Year"] = df[date_column].dt.year
        df["Month"] = df[date_column].dt.month
        df["MonthStr"] = df[date_column].dt.strftime('%Y-%m')
        df["Day"] = df[date_column].dt.day
        df["Date"] = df[date_column].dt.date

        st.write("Forecast at what level?")
        granularity = st.radio("Forecast at what level?", ["Year", "Month", "Date"])

        df["DateFull"] = pd.to_datetime(df[["Year", "Month", "Day"]], errors='coerce')
        df.dropna(subset=[selected_trans_column], inplace=True)

        if granularity == "Year":
            min_year, max_year = sorted(df["Year"].unique())[0], sorted(df["Year"].unique())[-1]
            selected_min_year = st.selectbox("Select Min Year", sorted(df["Year"].unique()))
            selected_max_year = st.selectbox("Select Max Year", sorted(df["Year"].unique()))

            df = df[(df["Year"] >= selected_min_year) & (df["Year"] <= selected_max_year)]
            group_cols = selected_forecast_columns + ["Year"]
            agg_df = df.groupby(group_cols)[selected_trans_column].sum().reset_index()

            st.write("🔢 Aggregated Year-wise Data")
            st.dataframe(agg_df)

        elif granularity == "Month":
            month_type = st.radio("Monthly aggregation:", ["Same value over years", "All values over years"])
            df["Month"] = df[date_column].dt.month
            df["Year"] = df[date_column].dt.year
            all_months = sorted(df["Month"].unique())
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

        elif granularity == "Date":
            date_type = st.radio("Daily aggregation:", ["Same value over years", "All values over years"])
            df["Day"] = df[date_column].dt.day
            df["Month"] = df[date_column].dt.month
            df["Year"] = df[date_column].dt.year

            all_days = sorted(df["Day"].unique())
            all_months = sorted(df["Month"].unique())
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
                    ax.set_xticks(x_vals.tolist() + forecast_x_vals.tolist())
                    ax.set_xticklabels([str(y) for y in x_vals.tolist() + forecast_x_vals.tolist()])

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


                # Plot the original data
                ax.plot(x_vals, agg_df[selected_trans_column], label="Original", color='blue')

                # Plot the forecasted data with color-coded points
                ax.plot(forecast_x_vals, forecast_df[selected_trans_column], label="Forecast", color=colors[0], linestyle='-', marker='x')

                # Add labels and legend
                ax.set_ylabel(selected_trans_column)
                ax.legend()

                # Show the plot
                st.pyplot(fig)


else:
    st.warning("Please upload a CSV file.")