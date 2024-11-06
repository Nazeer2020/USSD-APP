# USSD Offers Application

This application is built using Deno and serves as an interface between a USSD gateway and a third-party API to provide users with offers based on their MSISDN.

## Overview

When a user interacts with the USSD gateway app, the application receives their request along with their unique MSISDN. It then fetches exciting offers from a third-party API in XML format. But that’s not all! The app smartly converts this XML data into JSON, organizes it into a user-friendly menu, and sends it back to the USSD gateway as plain text.

What’s even cooler? The app uses a session ID provided by the USSD gateway to track the user's journey through the menus. This means that as users explore different offers, the application keeps everything in sync, making the experience smooth and intuitive.

When a user selects an offer they like, the application seamlessly calls the activation API of the third party. Plus, it logs each interaction in a log file, so you can keep track of all operations.

## Getting Started

These instructions will help you set up and run the application locally.

### Prerequisites

- [Deno](https://deno.land/) installed on your machine.

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Nazeer2020/USSD-APP
cd USSD-APP
