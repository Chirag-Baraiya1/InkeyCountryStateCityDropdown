# Inkey Country State City Manual

This guide walks you through the process of downloading, importing, configuring, and validating the **InkeyCountryStateCityDropdown** PCF control for the **Country**, **State**, and **City** fields in a Model-driven App.

The **InkeyCountryStateCityDropdown** PCF control is distributed as a **Managed Solution** and is available from the project's GitHub repository.

---

## Download the PCF Control

To download the latest version:

1. Open the GitHub repository using the link below.

   **GitHub Repository:**  
   https://github.com/ank8shah/InkeyCountryStateCityDropdown

   ![Screenshot](PCF_ScreenShort_Updated/Image_11.png)

2. Navigate to the **Releases** section.

   ![Screenshot](PCF_ScreenShort_Updated/Image_12.png)

3. Download the latest **Managed Solution (.zip)** file from the **Assets** section.

   ![Screenshot](PCF_ScreenShort_Updated/Image_12.png)

4. Import the downloaded solution into your Power Platform environment.

   ![Screenshot](PCF_ScreenShort_Updated/Image_13.png)

---

# Configure the Control for Country, State, and City Fields

After importing the managed solution, configure the **InkeyCountryStateCityDropdown** PCF control on your Model-driven App form.

## Prerequisites

Before configuring the control, ensure that your Dataverse table contains the following **Single Line of Text** columns:

- Country
- State
- City

> **Note:** The same PCF control is used for all three fields. The behavior of the control is determined by the **Mode** property.

---

# Step 1: Configure the Country Field

1. Open your table in **Power Apps**.
2. Edit the required **Main Form**.

   ![Screenshot](PCF_ScreenShort_Updated/Image_00.png)

3. Select the **Country** field.

   ![Screenshot](PCF_ScreenShort_Updated/Image_00.png)

4. Go to the **Components** tab and add the **InkeyCountryStateCityDropdown** control.

   **(+ Component → Get More Components)**

   ![Screenshot](PCF_ScreenShort_Updated/Image_02.png)

   ![Screenshot](PCF_ScreenShort_Updated/Image_03.png)

5. Configure the properties as shown below.

| Property | Value |
|----------|-------|
| Mode | Country |
| Country | Leave Empty |
| State | Leave Empty |

6. Under **Show component on**, select **Web**, **Phone**, and **Tablet** (or the platforms required for your app).

   ![Screenshot](PCF_ScreenShort_Updated/Image_06.png)

---

# Step 2: Configure the State Field

1. Select the **State** field.
2. Add the **InkeyCountryStateCityDropdown** control.
3. Configure the properties as shown below.

| Property | Value |
|----------|-------|
| Mode | State |
| Country | Bind to the Country column |
| State | Leave Empty |

4. Under **Show component on**, select **Web**, **Phone**, and **Tablet** (or the platforms required for your app).

This configuration automatically filters the available **States** based on the selected **Country**.

![Screenshot](PCF_ScreenShort_Updated/Image_07.png)

---

# Step 3: Configure the City Field

1. Select the **City** field.
2. Add the **InkeyCountryStateCityDropdown** control.
3. Configure the properties as shown below.

| Property | Value |
|----------|-------|
| Mode | City |
| Country | Bind to the Country column |
| State | Bind to the State column |

4. Under **Show component on**, select **Web**, **Phone**, and **Tablet** (or the platforms required for your app).

This configuration automatically filters the available **Cities** based on the selected **State**.

![Screenshot](PCF_ScreenShort_Updated/Image_08.png)

---

# Save and Publish

Once all three fields have been configured:

1. Save the form.
2. Publish all customizations.
3. Open a record to verify the control.

## Validation

- Select a **Country**.
- Only the related **States** will be displayed.
- Select a **State**.
- Only the corresponding **Cities** will be displayed.

This provides a clean and intuitive cascading dropdown experience for Model-driven Apps.
