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
* Click on **Start VPC Wizard**.
* On the **Step 1: Select a VPC Configuration** screen, make sure that
  **VPC with a Single Public Subnet** is highlighted and click
  **Select**.
* Name your VPC. Enter <code>defaultvpc</code> in the **VPC name** field.
* Enter <code>defaultvpc.internal.us-east-1</code> for **Subnet name**.
* Click **Create VPC**.

1. Create an EC2 role.
* Goto Console > Identity & Access Management > Roles.
* Click **Create New Role**.
* Set **Role Name** to <code>BaseIAMRole</code>. Click **Next Step**.
* On **Select Role Type** screen, hit **Select** for **Amazon EC2**.
* Click the radio button next to **PowerUserAccess**, then
  click **Next Step**.
* On **Review** screen, click **Create Role**.
* EC2 instances launched with Spinnaker will be associated with this
role.

1. Create an EC2 Key Pair for connecting to your instances.
* Visit Console > EC2 > Key Pairs.
* Click **Create Key Pair**.
* Name the key pair <code>my-aws-account-keypair</code>.

1. Create AWS credentials for Spinnaker.
* Console > Identity & Access Management > Users > Create New
  Users. Enter a username and hit **Create**.
* Create an access key for the user. Click **Download Credentials**,
    then Save the access key and secret key into
    <code>~/.aws/credentials</code> as shown
    [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files).
* Click on the username you entered for a more detailed screen.
* On the **Summary** page, click on the **Permissions** tab.
* Click on the **Inline Policies** header, then click the link to
  create an inline policy.
* Click **Select** for **Policy Generator**.
* Select **AWS Access and Identity Management** from the **AWS Service** pulldown.
* Select **PassRole** for **Actions**.
* Type <code>*</code> (the asterisk character) in the **Amazon Resource Name (ARN)** box.
* Click **Add Statement**, then **Next Step**.
* Click **Apply Policy**.

### Setup a Google Cloud Platform project

If you'd like to have Spinnaker deploy to and manage clusters on GCP,
you'll need to have a GCP project setup. If you've already got one,
please skip to the next step. Otherwise, please follow the
instructions below.

Sign into the [Google Developer's
Console](https://console.devleopers.google.com) and create a
project. Call it <code>MySpinnakerProject</code>.

1. Enable APIs in the <code>MySpinnakerProject</code> project.
  * Go to the API Management page.
  * Enable the [Compute
    Engine](https://console.developers.google.com/apis/api/compute_component/overview?project=_)
    and [Compute Engine
    Autoscaler](https://console.developers.google.com/apis/api/autoscaler/overview?project=_)
    APIs.
1. Add and obtain credentials.
  * Navigate to the **Credentials** tab (if using the beta console, it is
    in API Manager).
  * Select **Service account** and create a JSON key.
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
        project: myspinnakerproject
        jsonPath: <filename containing the JSON key generated in Step 1>

## Step 4. Start Spinnaker

To start Spinnaker, simply type:

    sudo /opt/spinnaker/start_spinnaker.sh --all

The above command starts all Spinnaker components, including Redis and
Cassandra, which Spinnaker components use to store data. Note that it
can take several minutes for Spinnaker to start.

## Step 5. Configure example pipeline

To walk you through some of the basics with Spinnaker, you're going to
setup a Spinnaker pipeline that bakes a virtual machine (VM) image
containing redis, then deploys that image to a test cluster.

### Create a Spinnaker application

* In Spinnaker, click **Create Application** in the **Actions**
  dropdown.
* Input <code>example</code> for the **Name** field and your email address for
the **Owner Email** field.
* Click inside of the dashed rectangle below the **Accounts** heading.
  * Click <code>my-aws-account</code> if you are deploying to AWS or
<code>my-google-account</code> if you are deploying to Google Cloud Platform.
* Click on the **Consider only cloud provider health when executing
  tasks** button next to **Instance Health**.
* Click the **Create** button.

### Create and configure a security group

Next, you'll create a security group that specifies traffic firewall
rules for the cluster. You'll configure the firewall rules to allow
all incoming traffic on port 80, for clusters associated with this
security group.

* Click **SECURITY GROUPS**, then click **Create Security Group**.
* Input <code>test</code> for the **Detail (optional)** field and
<code>Test environment</code> for the **Description** field.
* Click **Next**.
* Click **Add New Source CIDR** and use the default
  <code>0.0.0.0/0</code> value for the **Source Range** field.
* Click **Add New Protocol and Port Range**. Use the default <code>TCP</code>
  value for the **Protocol** field. Change **Start Port** and **End
  Port** to <code>80</code>.
* Click the **Create** button.

### Create a load balancer

Next, you'll create a load balancer in Spinnaker.

* Click **LOAD BALANCERS**, then click **Create Load Balancer**.
* Input <code>test</code> for the **Stack** field, then click the
  **Next** button.
* Unselect the **Enable health check?** checkbox.
* Click the **Create** button.

### Create a deployment pipeline

Your final task is to set up a Spinnaker pipeline. Let's call it
**Bake & Deploy to Test**. The pipeline will produce an image
containing the <code>redis-server</code> package and then deploy
it. In this tutorial, you'll trigger the pipeline manually.

To create the pipeline:

* Click **PIPELINES**, then click **Configure** and select **Create
  New Pipeline** from the dropdown.
* Input <code>Bake & Deploy to Test</code> for the **Pipeline Name**.
* Click the **Create Pipeline** button.

#### Set up the first stage of the pipeline

You're now going to create the first stage of the pipeline. It will
build an image from an existing redis-server package.

* Click **Add stage**.
* Select **Bake** from the **Type** pulldown menu.
* Input <code>redis-server</code> for the **Package** field.
* Click **Save Changes**.

#### Set up the second stage of the pipeline

You're now going to setup the second stage of the pipeline. It takes
the image constructed in the *Bake* stage and deploys it into a test
environment.

* Click **Add stage**.
* Select **Deploy** from the **Type** dropdown.
* Under the **Clusters** heading, click **Add cluster**.
* Click the **Continue without a template** button.

* Next, In the **Configure Deployment Cluster** window, input "test"
for the **Stack** field.
* Click the **Next** button.
* Click the text area next to the **Load Balancers** heading, then
  select <code>example-test</code>. Click the **Next** button.
* Click the **Security Groups** form field, then click
  <code>example-test (example-test)</code>. Click the **Next**
  button.
* Click the **Micro Utility** button to set the **Instance Profile**,
  then click the **Next** button.
* Select the **Micro** size, then click the **Next** button.
* Input <code>2</code> for the **Number of Instances** field, then click the
  **Add** button.
* Save the pipeline configuration by clicking the **Save Changes**
  button.

### Try it out!

* Click **PIPELINES** in the navigation bar.
* Click **Start Manual Execution** for the **Bake & Deploy to Test**
  pipeline.
* Click **Run**.

Now, watch Spinnaker in action. A **MANUAL START** section will
appear, and will show progress as the pipeline executes. At any point
during pipeline execution, click on the horizontal bar to see detailed
status for any of the stages in the pipeline.

Feel free to navigate around the Spinnaker menus, create new
pipelines, clusters, server groups, load balancers, and security
groups, etc. and see what happens.

When you're ready to stop, don't forget to cleanup your resources. An
easy way to do this is to visit the pipelines, clusters, load
balancers, and security groups pages, click on the ones created and
select the appropriate **Delete** command from the Actions pulldown on
the right.

## Step 6. Stop Spinnaker

To stop Spinnaker, type:

    sudo /opt/spinnaker/stop_spinnaker.sh --all

The above command stops all Spinnaker components, including Redis and
Cassandra.
