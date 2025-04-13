import streamlit as st
import pandas as pd

st.set_page_config(page_title="Salakk", page_icon="🔮")

st.title("Salakk")

# Step 1: Upload CSV
uploaded_file = st.file_uploader("Upload a CSV file", type=["csv"])

if uploaded_file is not None:
    # Step 2: Read the CSV and show it
    df = pd.read_csv(uploaded_file)
    
    # Display the dataframe to the user
    st.write("DataFrame preview:", df.head())
    
    # Step 3: Ask user to pick columns from the dataset
    columns = df.columns.tolist()
    selected_columns = st.multiselect("Select columns to group by", columns)

    if selected_columns:
        # Step 4: Group the dataframe by selected columns and show the count of distinct rows for combinations
        grouped_df = df.groupby(selected_columns).size().reset_index(name='count')
        
        st.write("Grouped DataFrame (distinct row counts):", grouped_df)
    else:
        st.warning("Please select atleast a column to proceed.")
    
    # Step 5: Ask user to select the date column
    st.write("Please select the date column in the CSV")
    date_column = st.selectbox("Select the date column", columns)

    # Step 6: Ask user for what store/product or both they want to see the forecast for
    st.write("Please pick the thing you want to see the forecast for, you can pick combination as well.")
    selected_forecast_columns = st.multiselect("Please pick them here", columns)

    st.write("Please pick what you want to see aggregated/forecast numerical column.")
    selected_trans_column = st.selectbox("Please select here",columns)
    
    # Granularity-related initializations
    granularity = None
    selected_min_year = None
    selected_min_month = None
    selected_min_date = None

    if selected_forecast_columns:
        filtered_df = df[selected_forecast_columns + [date_column]].copy()
        filtered_df[date_column] = pd.to_datetime(filtered_df[date_column])

        # Step: Ask for forecast granularity
        st.write("Select the level of forecast granularity")
        granularity = st.radio("Forecast at what level?", ["Year", "Month", "Date"])

        # Extract date parts
        filtered_df["Year"] = filtered_df[date_column].dt.year
        filtered_df["Month"] = filtered_df[date_column].dt.strftime('%Y-%m')  # String like '2024-07'
        filtered_df["Date"] = filtered_df[date_column].dt.date

        if granularity == "Year":
            min_year = filtered_df["Year"].min()
            max_year = filtered_df["Year"].max()
            selected_min_year = st.selectbox("Select Min Year", sorted(filtered_df["Year"].unique()))
            selected_max_year = st.selectbox("Select Max Year", sorted(filtered_df["Year"].unique()))
            st.write(f"Min Year: {min_year}, Max Year: {max_year}")

        elif granularity == "Month":
            month_options = sorted(filtered_df["Month"].unique())
            selected_min_month = st.selectbox("Select Min Month", month_options, index=0)
            selected_max_month = st.selectbox("Select Max Month", month_options, index=len(month_options) - 1)
            st.write(f"Min Month: {month_options[0]}, Max Month: {month_options[-1]}")

        elif granularity == "Date":
            date_options = sorted(filtered_df["Date"].unique())
            selected_min_date = st.selectbox("Select Min Date", date_options, index=0)
            selected_max_date = st.selectbox("Select Max Date", date_options, index=len(date_options) - 1)
            st.write(f"Min Date: {date_options[0]}, Max Date: {date_options[-1]}")

        else:
            st.warning("Please select a forecast granularity.")
    
    # Ensure date is in datetime format
    df[date_column] = pd.to_datetime(df[date_column])
    df["Year"] = df[date_column].dt.year
    df["Month"] = df[date_column].dt.month
    df["MonthStr"] = df[date_column].dt.strftime('%Y-%m')
    df["Day"] = df[date_column].dt.day
    df["Date"] = df[date_column].dt.date

    # Step 8: Preview of different dates across years/months.
    if granularity == "Year":
        preview_df = df[
            (df["Year"] >= selected_min_year) & (df["Year"] <= selected_max_year)
        ].groupby("Year")[selected_trans_column].sum().reset_index()

        st.write("🔢 Year-wise Aggregated Data:")
        st.dataframe(preview_df)

    elif granularity == "Month":
        selected_dt_min = pd.to_datetime(selected_min_month)
        fixed_month = selected_dt_min.month
        start_year = selected_dt_min.year
        end_year = pd.to_datetime(selected_max_month).year

        preview_df = df[
            (df["Month"] == fixed_month) &
            (df["Year"] >= start_year) &
            (df["Year"] <= end_year)
        ]

        agg_df = preview_df.groupby(["Year", "Month"])[selected_trans_column].sum().reset_index()
        st.write(f"📆 Aggregated data for Month = {fixed_month} across selected years:")
        st.dataframe(agg_df)

    elif granularity == "Date":
        selected_dt_min = pd.to_datetime(selected_min_date)
        fixed_month = selected_dt_min.month
        fixed_day = selected_dt_min.day
        start_year = selected_dt_min.year
        end_year = pd.to_datetime(selected_max_date).year

        preview_df = df[
            (df["Month"] == fixed_month) &
            (df["Day"] == fixed_day) &
            (df["Year"] >= start_year) &
            (df["Year"] <= end_year)
        ]

        agg_df = preview_df.groupby(["Year", "Month", "Day"])[selected_trans_column].sum().reset_index()
        st.write(f"📅 Aggregated data for Day = {fixed_day}, Month = {fixed_month} across selected years:")
        st.dataframe(agg_df)

    else:
        st.warning("Please select a valid granularity.")

else:
    st.warning("Please upload a CSV file.")