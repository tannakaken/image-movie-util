import Ffmpeg from "fluent-ffmpeg";

export const serialImageToWebm = (numberOfDigits: number, dirPath: string, targetPath: string) => {
    return new Promise<void>((resolve, reject) => {
        Ffmpeg(`${dirPath}/%0${numberOfDigits}d.png`)
        .inputOptions([
        ])
        .output(targetPath)
        .outputOption([
            '-r 24',
            '-c:v libvpx-vp9',
            '-vf format=yuva420p',
            '-crf 24',
            '-b:v 0',
        ])
        .on('end', function() {
            resolve();
        })
        .on('error', (error: {message: string}) => {
            reject(error.message);
        })
        .run();
    })   
}
