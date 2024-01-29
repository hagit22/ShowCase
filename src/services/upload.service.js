
export async function uploadImage(ev) {
  const CLOUD_NAME = "dyqbgymxz"
  const UPLOAD_PRESET = "myseb6rn"
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  try {
    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', ev.target.files[0])

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
    const imgUrl = await res.json()
    return imgUrl
  } 
  catch (err) {
    console.error('Failed to upload', err)
    throw err
  }
}

