import crypto from 'crypto';
const SECRET = "M%C3%A9xico%20es%20un%20pa%C3%ADs%20de%20am%C3%A9rica%20"
export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt:string, password:string) => {
    return crypto.createHmac('sha256',[salt,password].join('/')).update(SECRET).digest('hex');
}