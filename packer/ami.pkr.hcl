packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "ami_users" {
  type = list(string)
}

variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}

variable source_ami {
  type = string
}

variable "ami_name" {
  type = string
}

variable "ami_description" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "db_password" {
  type = string
}

variable "port" {
  type = number
}

variable "db_username" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_host" {
  type = string
}

variable "db_dialect" {
  type = string
}

variable "volume_size" {
  type = number
}

variable "volume_type" {
  type = string
}

variable "delay_seconds" {
  type = number
}

variable "max_attempts" {
  type = number
}

source "amazon-ebs" "assignment4dev" {
  ami_name        = "${var.ami_name}_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = var.ami_description
  instance_type   = var.instance_type
  access_key      = var.aws_access_key_id
  secret_key      = var.aws_secret_access_key
  region          = var.aws_region
  source_ami      = var.source_ami
  subnet_id       = var.subnet_id
  ami_users       = var.ami_users

  aws_polling {
    delay_seconds = var.delay_seconds
    max_attempts  = var.max_attempts
  }

  ami_block_device_mappings {
    device_name = "/dev/sda1"
    volume_size = var.volume_size
    volume_type = var.volume_type
  }
  ssh_username = varr.ssh_username
}

build {
  sources = ["source.amazon-ebs.assignment4dev"]

  provisioner "file" {
    source      = "./startup.service"
    destination = "/tmp/startup.service"
  }

  provisioner "file" {
    source      = "../webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "DB_PASSWORD=${var.db_password}",
      "PORT=${var.port}",
      "DB_USERNAME=${var.db_username}",
      "DB_NAME=${var.db_name}",
      "DB_HOST=${var.db_host}",
      "DB_DIALECT=${var.db_dialect}"
    ]
    script = "./appStartup.sh"
  }
}

