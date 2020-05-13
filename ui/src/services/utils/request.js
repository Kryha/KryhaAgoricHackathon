import { BACKEND_URL } from '../../constants'

export const backendPostRequest = async (relativeUrl, data) => {
  try {
    const url = `${BACKEND_URL}/${relativeUrl}`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(data || [])
    })
    const json = await response.json()
    return { status: response.status, ...json }
  } catch (err) { console.log(`Post on ${relativeUrl} failed with error: `, err) }
}

export const backendGetRequest = async (relativeUrl) => {
  try {
    const url = `${BACKEND_URL}/${relativeUrl}`
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
    const json = await response.json()
    return { status: response.status, ...json }
  } catch (err) { console.log(`Get on ${relativeUrl} failed with error: `, err) }
}
