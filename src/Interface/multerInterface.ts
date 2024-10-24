interface IMulterS3File {
  location: string;
  key: string;
  bucket: string;
  contentType: string;
  size: number;
}

export default IMulterS3File