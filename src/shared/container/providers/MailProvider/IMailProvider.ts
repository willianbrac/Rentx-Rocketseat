/* eslint-disable @typescript-eslint/no-explicit-any */
interface IMailProvider {
    sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string
    ): Promise<void>;
}

export { IMailProvider };

/**
 * to: Para quem
 * subject: assunto
 *
 */
