const express = require('express')
const fs = require('fs')
const path = require('path')
const reader = require('./classes/Reader')

let res = path.join(__dirname, "res")
let r = new reader(res)

console.log(r.data)