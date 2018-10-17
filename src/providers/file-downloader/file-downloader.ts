import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';

@Injectable()
export class FileDownloader {
  constructor(
    private file: File,
    private transfer: FileTransfer
  ) {
  }

  public async downloadFile(url: string, saveLocally: boolean = false): Promise<string> {
    let fileTransfer: FileTransferObject = this.transfer.create();
    let dest: string = this.file.dataDirectory + "temp.mp4";

    try {
      let downloadedFile = await fileTransfer.download(url, dest);
      return downloadedFile.toURL();
    } catch(e) {
      throw new Error();
    }
  }
}
