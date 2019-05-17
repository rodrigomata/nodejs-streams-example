// :: Using streams to avoid loading the entire file in order to write to it.
// :: This will allow scalability, and prevent large memory reads

import { createReadStream, createWriteStream } from 'fs'
// :: This library helps wrapping a generator into a readable stream to be piped
// :: https://www.npmjs.com/package/async-stream-generator
const streamify = require("async-stream-generator");

// :: Use a generator to wait to the read stream to finish, adding chunks to later parse them
async function* addChunk(chunks: any, body: any) {
    let data = ''
    for await (const chunk of chunks) {
        data += chunk.toString()
    }
    // :: Small validation in case the file is empty
    const modifiedChunk = data.length ? JSON.parse(data) : []
    // :: Add data as requested
    modifiedChunk.push([(new Date).getTime(), body])
    yield JSON.stringify(modifiedChunk)
}

// :: Having this functionality separated, allows the code to be more readable and maintanable
export const saveData = (request: any, response: any) => {
    // :: The name of the file to create
    const file = `${request.params.target}.log`
    // :: The read stream is created with a+ to create log files in case they do not exist
    const readStream = createReadStream(file, { flags: 'a+' })
    // :: Overriden default write flag, to avoid the file to be truncated
    const writeStream = createWriteStream(file, { flags: 'r+' })
    // :: Pipe the streams
    streamify(addChunk(readStream, request.body)).pipe(writeStream)

    // :: Send the response as we are not waiting for the log to finish
    response.status(200).send('Log updated')
}