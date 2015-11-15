---
layout: toc-page
title: Getting Started
id: getting_started
lang: en
---

* Table of contents. This line is required to start the list.
{:toc}

### **TODO: Put Google Cloud Launcher instructions here, cuz it'll be so easy.**

### **TODO: Add images to make it easy to follow.**

### **TODO: Make sure instructions are not AWS-only or GCE-only.**

# Getting started

These instructions quickly get Spinnaker up and running on an Amazon
Web Services (AWS) EC2 or Google Compute Engine (GCE) virtual machine
(VM) or local machine, then walk you through the steps of setting up
and using Spinnaker to deploy to and manage clusters on AWS and/or
GCE.

You will go through the following steps:

1. Setup a project representing your target deployment environment on
either AWS or GCP. This project will house the clusters that are
deployed and managed by Spinnaker.
1. Install Spinnaker on an AWS EC2 VM, GCE VM, or local machine.
1. Edit a Spinnaker configuration file to populate it with the
information from Step 1.
1. Start Spinnaker.
1. Configure an example Spinnaker pipeline to bake an image and deploy
the image to a cluster.
1. When you're done experimenting, clean everything up and stop Spinnaker.

The first step, which has nothing to do with Spinnaker itself, is by
far the most complex step.

## Step 1: Set up your target deployment environment

You need to setup your target deployment environment, which is an AWS
or GCP project that will house clusters that are deployed to and
managed by Spinnaker. You can choose to setup only an [AWS
environment](#setup-an-aws-project), a [GCP
environment](#setup-a-google-cloud-platform-project), or both. Please
follow the appropriate instructions below to get your target
deployment environment(s) setup.

### Setup an AWS project

If you'd like to have Spinnaker deploy to and manage clusters on AWS,
you'll need to have an AWS project setup. If you've already got one,
please skip to the next step. Otherwise, please follow the
instructions below.

Sign into the [AWS console](https://console.aws.amazon.com) and let
AWS pick a default region where your project resources will be
allocated. In the rest of this tutorial, we'll assume that the region
assigned is <code>us-east-1</code>. If the region selected for your
project is different from this, please substitue your region
everywhere <code>us-east-1</code> appears below.

Also, in the instructions below, we'll assume that your AWS account
name is <code>my-aws-account</code>. Wherever you see
<code>my-aws-account</code> appear below, please replace it with your
AWS account name.

1. Click on Networking > VPC.
1. Name your VPC. Edit the name tag, and give it the value
<code>defaultvpc</code>.
1. Name your subnets. Edit the name tag and give it the value
<code>defaultvpc.internal.us-east-1</code>.
1. Create an EC2 role called </code>BaseIAMRole</code>.
  * Goto Console > Identity & Access Management > Roles > Create New
    Role. Select Amazon EC2.
  * You don't have to apply any policies to this role. EC2 instances
    launched with Spinnaker will be associated with this role.
1. Create an EC2 Key Pair for connecting to your instances.
  * Visit Console > EC2 > Key Pairs > Create Key Pair. Name the key
    pair <code>my-aws-account-keypair</code>.
1. Create AWS credentials for Spinnaker.
  * Console > Identity & Access Management > Users > Create New
    Users. Enter a username.
  * Create an access key for the user. Save the access key and secret
    key into <code>~/.aws/credentials</code> as shown
    [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files).
  * Edit the user Permissions. Attach a Policy to the user granting
    PowerUserAccess. Create an inline policy for IAM granting PassRole
    on the resource.

### Setup a Google Cloud Platform project

If you'd like to have Spinnaker deploy to and manage clusters on GCP,
you'll need to have a GCP project setup. If you've already got one,
please skip to the next step. Otherwise, please follow the
instructions below.

Sign into the [Google Developer's
Console](https://console.devleopers.google.com) and create a
project. Call it <code>MySpinnakerProject</code>. Take note of the
project id, as you'll need this when editing the Spinnaker
configuration file in [Step
3](#step-3-update-the-spinnaker-configuration-file). it should be of
the form <code>myspinnakerproject-xxxx</code>, where
<code>myspinnakerproject</code> is the lowercase translation of your
project and <code>xxxx</code> is a (typically four-digit) number.

1. Enable APIs in the <code>MySpinnakerProject</code> project.
  * Go to the API Management page.
  * Enable the [Compute
    Engine](https://console.developers.google.com/apis/api/compute_component/overview?project=_)
    and [Compute Engine
    Autoscaler](https://console.developers.google.com/apis/api/autoscaler/overview?project=_)
    APIs.
1. Add and obtain credentials.
  * Navigate to the Credentials tab (if using the beta console, it is
    in API Manager).
  * Select "Service account" and create a JSON key.
  * Download this key to a file. Google Cloud Platform will pick the
    name of the file for you. Keep track of the name of the file and
    where it gets downloaded. You'll need this information in [Step
    3](#step-3-update-the-spinnaker-configuration-file).
  * <code>chmod 400</code> this file.

## Step 2: Install Spinnaker

If you have chosen to run Spinnaker inside an Amazon Web Services or
Google Compute Engine VM, please ssh into the VM.

Irrespective of the machine on which you have chosen to run Spinnaker,
at the command prompt, type in (or cut-and-paste) the following
command:

    curl -L https://dl.bintray.com/spinnaker/ospackages/install_spinnaker.sh | bash

## Step 3: Update the Spinnaker configuration file

Before you can run Spinnaker, you need to update the Spinnaker
configuration file <code>spinnaker-local.yml</code> with information
related to your AWS or GCP project and credentials.

### Required edits if deploying to AWS

If you're deploying to and managing clusters on AWS, make sure the
following is set in <code>spinnaker-local.yml</code>:

    providers:
      ...
      aws:
        enabled: true
        defaultRegion: us-east-1

If you chose a different region than <code>us-east-1</code>, please
ensure that <code>defaultRegion</code> is set to the region you
selected.

### Required edits if deploying to Google Cloud Platform

If you're deploying to and managing clusters on Google Cloud Platform,
make sure the following is set in <code>spinnaker-local.yml</code>:

    providers:
      ...
      google:
        enabled: true
        project: <your project id from Step 1>
        jsonPath: <filename containing the JSON key generated in Step 1>

## Step 4. Start Spinnaker

To start Spinnaker, simply type:

    sudo /opt/spinnaker/start_spinnaker.sh --all

The above command starts all Spinnaker components, including Redis and
Cassandra, which Spinnaker components use to store data.

## Step 5. Configure example pipeline

**CURRENT THINKING: ON MANUAL TRIGGER, BAKE AN IMAGE (REDIS) AND
  DEPLOY IT TO A TEST ENVIRONMENT**

## Step 6. Stop Spinnaker

To stop Spinnaker, type:

    sudo /opt/spinnaker/stop_spinnaker.sh --all

The above command stops all Spinnaker components, including Redis and
Cassandra.
