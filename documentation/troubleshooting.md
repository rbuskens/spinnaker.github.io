---
layout: toc-page
title: Troubleshooting
id: troubleshooting
lang: en
---

* Table of contents. This line is required to start the list.
{:toc}

# Having problems? Check out our troubleshooting guide below!

#### I can't create an Application.
The Spinnaker service responsible for creating applications is [front50](https://github.com/spinnaker/front50). It "creates" an application by adding a row to cassandra. The first place to look is in `/var/log/spinnaker/front50/front50.log`. If you see a bunch of stack traces with references to `astyanax`, we're on the right track. The problem is that when cassandra is upgraded, it can sometimes disable the thrift server. So we're going to first see if cassandra is available at all, and then we'll check if thrift is enabled.

Check if cassandra is available via `cqlsh`. If you can connect to the cluster, cassandra is installed and available.

Next, check if cassandra has thrift enabled via `curl localhost:9160`. If you get a connection refused, thrift is not enabled (as opposed to an 'empty reply'). So, we need to enable it via this command: `nodetool enablethrift`.

Since this setting won't survive a restart of cassandra, we also need to make it durable by editing `/etc/cassandra/cassandra.yaml`. Find the `start_rpc` flag and set it to `true`.

Try curl'ing `localhost:9160` again. So long as the connection is not refused, thrift is now enabled.

The last step is to restart the two Spinnaker services that require cassandra to be available on startup: `sudo service front50 restart` and `sudo service echo restart`.

We will be making [front50](https://github.com/spinnaker/front50) and [echo](https://github.com/spinnaker/echo) more tolerant of an unavailable or misconfigured cassandra cluster on startup shortly.
