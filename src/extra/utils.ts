import bcrypt from 'bcryptjs';
import {PasswordEnum} from './enum';


export async function encryptUserPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, PasswordEnum.SALT_GENERATED, (err, hash) => {
            if(err) reject(err);
            resolve(hash!);
        });
    });
}
