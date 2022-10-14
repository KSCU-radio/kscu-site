
import fetch from 'node-fetch';

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
    try {
        console.log(new Date().toISOString())
        const url = `https://spinitron.com/api/`
        const access_string = `?access-token=`
        const _key = process.env.KEY
        show_url = url + `shows/` + access_string + _key + `&count=1`
        let response = await fetch(show_url);
        let data = await response.json();
        console.log("Recieved data...");
        items = data["items"][0]

        show_title = items['title']
        console.log("Show title: " + show_title)
        category = items['category']
        // console.log("Category: " + category)

        start_time = items['start']
        console.log("Show start time: " + start_time)
        end_time = items['end']
        console.log("Show end time: " + end_time)
        duration = items['duration']
        // console.log("Show duration: " + duration)

        links = items['_links']
        DJ_api_link = links['personas'][0]['href']
        let DJresponse = await fetch(DJ_api_link);
        let DJdata = await DJresponse.json();
        // console.log(DJdata)

        DJ_name = DJdata['name']
        console.log("DJ name: " + DJ_name)
        DJ_bio = DJdata['bio']
        DJ_since = DJdata['since']

        return {
            statusCode: 200,
            body: JSON.stringify({
                title: `${show_title}`,
                category: `${category}`,
                start_time: `${start_time}`,
                end_time: `${end_time}`,
                duration: `${duration}`,
                DJ_name: `${DJ_name}`,
                DJ_bio: `${DJ_bio}`,
                DJ_since: `${DJ_since}`
            },
            ),
            // // more keys you can return:
            // headers: { "headerName": "headerValue", ... },
            // isBase64Encoded: true,
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
