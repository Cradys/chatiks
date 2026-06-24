import fs from 'node:fs'
import path from 'node:path'

const files = fs.readdirSync('./json_schemas')
export let schemas: Record<string, Record<string, any>> = {}

files.forEach(file => {
  const content = fs.readFileSync(`./json_schemas/${file}`)
  schemas[path.parse(file).name] = {schema: JSON.parse(content.toString()).properties}
});