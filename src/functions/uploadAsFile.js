 import { storage} from "../firebase";
 export const uploadAsFile = async (uri, progressCallback, name) => {

  console.log("uploadAsFile", uri)
  const response = await fetch(uri);
  const blob = await response.blob();

  var metadata = {
    contentType: 'image/jpeg',
  };

  // let name = new Date().getTime() + "-media.jpg"
  const ref = storage
    .ref()
    .child('assets/' + name)

  const task = ref.put(blob, metadata);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => reject(error), /* this is where you would put an error callback! */
      () => {
        ref.getDownloadURL().then((res) => resolve(res))

        // save a reference to the image for listing purposes
        // var ref = firebase.database().ref('assets');
        // ref.push({
        //   'URL': downloadURL,
        //   //'thumb': _imageData['thumb'],
        //   'name': name,
        //   //'coords': _imageData['coords'],
        //   'user': auth.currentUser && auth.currentUser.uid,
        //   'datetime': new Date().getTime()
        // }).then(r => resolve(r), e => reject(e))
        // resolve('ok')
      }
    );
  });
}
