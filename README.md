<h1 align="center">
  bolt: The Universal Project Runner
</h1>

<p align="center">
<strong>
  Run Docker containers, child processes, or even encapsulate your entire project within a VM, all under one unified API.
</strong>
</p>

<p align="center">
  <a href="https://github.com/gluestack/bolt-framework/issues/new">Report Bug</a>
  ·
  <a href="https://github.com/gluestack/bolt-framework/issues/new">Request Feature</a>
</p>

<hr style="border: 1px solid gray">

## :question: What is bolt?

bolt is the Universal Project Runner that runs Docker containers, child processes, or even encapsulate your entire project within a VM, all under one unified API.

Below's brief overview of bolt's architecture -

![Bolt Architecture](https://raw.github.com/gluestack/bolt-framework/main/Bolt.svg)

## :thinking: Why bolt?

Running projects locally requires running system services and using system resources.

For eg: A project may need to run a Postgres instance, an iOS simulator and a Node watcher & bundler.

It can get cumbersome when you set up everything manually because you may need a Docker instance for the Postgres, a child process on the host machine to boot the iOS simulator and another child process for the Node packager. The Node packager can also run as a Docker instance.

And when you run all these, the host machine may slow down and you may have to move things inside a VM. Bolt solves all those problems with a unified API for managing services (boot, kill, restart, fetch logs).

Below's brief overview of how bolt's architecture designed to help in such scenarios  -

![Why Bolt?](https://raw.github.com/gluestack/bolt-framework/main/WhyBolt.svg)

## :fire: Features

* Allows you to run multiple services from a single project on different environments
* You can run a service on your host machine locally or within Bolt's prepared virtual machine
* Auto-detection helps you quickly get started with the Bolt file configuration
* Available environments include:
  * Host machine's local environment
  * Host machine's Docker environment
  * Virtual machine's local environment
  * Virtual machine's Docker environment
* Includes the log command to monitor and print logs from processes, Docker containers, or virtual machines
* Facilitates access to your project's virtual machine

## :beginner: Getting started

* [Introduction](https://bolt.gluestack.io/docs/getting-started/introduction)
* [Terminologies](https://bolt.gluestack.io/docs/getting-started/terminologies)
* [Installation Guide](https://bolt.gluestack.io/docs/getting-started/installing-the-global-cli)
* [Your First Bolt Project](https://bolt.gluestack.io/docs/getting-started/your-first-bolt-project)
* [Add Bolt to Existing Project](https://bolt.gluestack.io/docs/getting-started/add-bolt-to-existing-project)
* [ENV Management](https://bolt.gluestack.io/docs/getting-started/env-management)
* [Service Management](https://bolt.gluestack.io/docs/getting-started/service-management)

Checkout our [documentation](https://bolt.gluestack.io/docs) to find out more and to go through our Tutorials & API References.

## :see_no_evil: Caveat

We are currently very much an Alpha product. Please file an issue if you face any problems. Please join our [Discord](https://discord.gg/GEP2gWgd) if you want to discuss your use-case.

## :telephone_receiver: For Contributing or Connecting with Us

Join our [Discord](https://discord.gg/GEP2gWgd)
