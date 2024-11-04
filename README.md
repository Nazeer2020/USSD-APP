# USSD Offers Application

This application is built using Deno and serves as an interface between a USSD gateway and a third-party API to provide users with offers based on their MSISDN.

## Overview

The application receives requests from a USSD gateway app along with the user's MSISDN (Mobile Station International Subscriber Directory Number). It then fetches offers for that MSISDN from a third-party API in XML format, converts the XML data to JSON, formats it as a menu, and sends it back to the USSD gateway as plain text. When a user selects an offer, the application calls the activation API of the third party and stores logs for each operation in a log file.

## Getting Started

These instructions will help you set up and run the application locally.

### Prerequisites

- [Deno](https://deno.land/) installed on your machine.

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Nazeer2020/USSD-APP
cd USSD-APP
