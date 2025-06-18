import bcrypt from 'bcryptjs';
import {PasswordEnum} from './enum';


export async function encryptUserPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, Number(PasswordEnum.SALT_GENERATED), (err, hash) => {
            if(err) reject(err);
            resolve(hash!);
        });
    });
}

export function comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword)
}