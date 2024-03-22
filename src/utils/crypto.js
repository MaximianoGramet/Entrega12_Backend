import crypto from 'crypto';

function generateUniqueToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buffer) => {
            if (err) {
                reject(err)
            } else {
                const token = buffer.toString('hex')
                resolve(token)
            }
        });
    });
}

export default generateUniqueToken
