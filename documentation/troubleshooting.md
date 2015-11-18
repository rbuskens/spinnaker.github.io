---
layout: toc-page
title: Troubleshooting
id: troubleshooting
lang: en
---

* Table of contents. This line is required to start the list.
{:toc}

# Troubleshooting Guide

## I can't create an Application.
This can manifest as either an endless spinner or as an error message rendered at the bottom of the Create Application dialog.

The Spinnaker service responsible for creating applications is [front50](https://github.com/spinnaker/front50). It "creates" an application by adding a row to Cassandra. The first place to look is in `/var/log/spinnaker/front50/front50.log`. If you see a bunch of stack traces with references to `astyanax`, we're on the right track. The problem is that when Cassandra is upgraded, it can sometimes disable the thrift server. So we're going to first see if Cassandra is available at all, and then we'll check if thrift is enabled.

1. Check if Cassandra is available via `cqlsh`. If you can connect to the cluster, Cassandra is installed and available.

1. Check if Cassandra has thrift enabled via `curl localhost:9160`. If you get a connection refused, thrift is not enabled (as opposed to an 'empty reply').

1. Enable thrift via this command: `nodetool enablethrift`.

1. Make this setting durable by editing `/etc/cassandra/cassandra.yaml`. Find the `start_rpc` flag and set it to `true`.

Thrift should now be enabled. Execute `curl localhost:9160` and verify that you receive an 'empty reply'.

The last step is to restart the two Spinnaker services that require Cassandra to be available on startup: `sudo service front50 restart` and `sudo service echo restart`.

We will be making front50 and [echo](https://github.com/spinnaker/echo) more tolerant of an unavailable or misconfigured Cassandra cluster on startup shortly.

## I changed my configuration. How do I get Spinnaker to pick up the modified configuration?
*Note: This section is useful mainly for operators who either used one of the pre-baked Spinnaker machine images or installed Spinnaker from the .deb files (usually on an AWS or GCE VM). If doing development locally, you can probably skip this section.*

There are various ways you can modify your configuration:
* Re-running `InstallSpinnaker.sh`
* Editing `/etc/default/spinnaker`
* Editing one of the `.yml` files (e.g. `/opt/spinnaker/config/spinnaker-local.yml`, `/opt/spinnaker/config/clouddriver.yml`, `/opt/rosco/config/rosco.yml`)
* Modifying environment variables
* Modifying `~/.aws/credentials`

If you've modified your configuration via any of those methods, the simplest way to have Spinnaker synchronize your configuration is to run these two commands:

\# Restart all Spinnaker services

`sudo restart spinnaker`

\# Update Deck (the browser application) settings

`sudo /opt/spinnaker/bin/reconfigure_spinnaker.sh`

You can also restart individual Spinnaker services:

`sudo service restart {service-name}`

For example, the two services that typically need to be restarted to pick up account-related changes can be restarted with these commands:

`sudo service restart clouddriver`

`sudo service restart rosco`

Clouddriver also exposes an entrypoint that can be used to refresh its account lists dynamically:

`curl -X POST localhost:7002/config-refresh`

But for the sake of simplicity and repeatability, the safest path is usually the coarse-grained `sudo restart spinnaker`.

## Where are the logs?
*Note: This section is useful mainly for operators who either used one of the pre-baked Spinnaker machine images or installed Spinnaker from the .deb files (usually on an AWS or GCE VM). If doing development locally, you can probably skip this section.*

Each service will write its logs to:

`/var/log/spinnaker/{service-name}/{service-name}.log`

For example:

`/var/log/spinnaker/clouddriver/clouddriver.log`

`/var/log/spinnaker/orca/orca.log`

`/var/log/spinnaker/rosco/rosco.log`

## Why can't I access Spinnaker using my machine's IP addr or hostname?
*Note: This section is useful mainly for operators who either used one of the pre-baked Spinnaker machine images or installed Spinnaker from the .deb files (usually on an AWS or GCE VM). If doing development locally, you can probably skip this section.*

There is no authentication on the services so they are currently bound to localhost (since the services have admin access to your environment).

A few ways you can remove this restriction:

1. Edit `/etc/apache/ports.conf` and change `Listen 127.0.0.1:9000` to `Listen 9000`
1. Add a reverse proxy for ports you wish to open in Apache
1. Edit config files in `/opt/spinnaker/conf` to disable the bind to `localhost`. Change `localhost` to domain name or `0.0.0.0`
