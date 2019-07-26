# Polarity TruSTAR Integration

The Polarity TruSTAR integration allows Polarity to search the TruSTAR API to return information about various indicator types.

To learn more about TruSTAR, please visit: [official website](https://www.trustar.co/)

You can check out the integration in action below:

![trustar](https://user-images.githubusercontent.com/22529325/61951369-d07b6a80-af7e-11e9-93b1-0bf56053b8f5.gif)

## TruSTAR Integration Options

### Base TruSTAR API URL

URL to your TruSTAR instance to use.

### TruSTAR API Key

API Key used to authenticate with TruSTAR.

### TruSTAR API Secret

API Secret used to authenticate with TruSTAR.


## TruSTAR Service Account Creation Instructions
Polarity recommends creating a dedicated TruSTAR service account for Polarity with access to only specific enclaves to be searched.  To create this account, first login to TruSTAR Station as an administrative user and navigate to Settings -> Users in the lower left corner of the application window.  Click "Add User" and supply a descriptive First and Last name as well as a valid e-mail address for the account.  The supplied e-mail address must be valid as this is the only way to obtain the account credentials to be used in the next step.  Under "Enclave Permissions", switch only those enclaves that you wish Polarity to search to "View Only".  All other Enclaves should be set to "No Access" as shown below:

<img width="500" src="https://user-images.githubusercontent.com/22529325/61950450-d754ae00-af7b-11e9-81c6-420e4118b379.png">

Once the user is saved, you should be able to login to TruSTAR Station with the credentials set via the e-mail received in the previous step.  Once you have logged in with the newly created account, navigate to Settings -> API and generate a new API Key and Secret as shown below:

<img width="500" src="https://user-images.githubusercontent.com/22529325/61950477-ef2c3200-af7b-11e9-8e14-a78d4c730779.png">

Copy the API Key and Secret and paste them into the appropriate Polarity TruSTAR integration configuration fields.

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
