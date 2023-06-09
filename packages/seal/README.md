## About @gluestack-seal/cli

> **Note:** This repository contains the cli code of the seal.

## Usage

```
  npm install -g @gluestack-seal/cli
```

# Commands

## seal command

```shell
$ seal
Usage: seal [options] [command]

Seal CLI tool

Options:
  -V, --version                           output the version number
  -h, --help                              display help for command

Commands:
  init                                    Inits the project with seal
  project:list                            Prints the list of available seal projects
  help [command]                          display help for command
```

## init command

```shell
$ seal init

> Installed seal in <project_path>
```

## project:list command

```shell
$ project:list

╔═══╤════════════════╤══════════════════════════════════════╗
║ # │ Project Name   │ Path                                 ║
╟───┼────────────────┼──────────────────────────────────────╢
║ 1 │ test           │ <path>/test                          ║
╟───┼────────────────┼──────────────────────────────────────╢
║ 2 │ sample-project │ <path>/sample-project                ║
╚═══╧════════════════╧══════════════════════════════════════╝
```

## run:service command

```shell
$ seal run:service -p docker website --ports=9000

```

```shell
$ seal run:service -p local website

```
