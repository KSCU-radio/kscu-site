
import fetch from 'node-fetch';

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
    try {
        console.log(new Date().toISOString())
        const url = `https://spinitron.com/api/`
        const access_string = `?access-token=`
        const _key = process.env.KEY
        show_url = url + `shows/` + access_string + _key + `&count=2`
        let response = await fetch(show_url);
        let data = await response.json();
        // console.log("Recieved data...");
        // items = data["items"][0]

        // show_title = items['title']
        // console.log("Show title: " + show_title)
        // category = items['category']
        // // console.log("Category: " + category)

        // start_time = items['start']
        // console.log("Show start time: " + start_time)
        // end_time = items['end']
        // console.log("Show end time: " + end_time)
        // duration = items['duration']
        // // console.log("Show duration: " + duration)

        // links = items['_links']
        // DJ_api_link = links['personas'][0]['href']
        // let DJresponse = await fetch(DJ_api_link);
        // let DJdata = await DJresponse.json();
        // // console.log(DJdata)

        // DJ_name = DJdata['name']
        // console.log("DJ name: " + DJ_name)
        // DJ_bio = DJdata['bio']
        // DJ_since = DJdata['since']

        // Fetch in parallel, using Promise.all, the DJ name from links['personas'][i]['href']
        const [currentDJPromise, nextDJPromise] = await Promise.all([
            fetch(data["items"][0]['_links']['personas'][0]['href']),
            fetch(data["items"][1]['_links']['personas'][0]['href'])
        ]);
        currentDJ = await currentDJPromise.json();
        nextDJ = await nextDJPromise.json();

        var toReturn = [{}, {}]
        // The current DJ
        toReturn[0]["DJ_name"] = currentDJ['name']
        // The next DJ
        toReturn[1]["DJ_name"] = nextDJ['name']
        
        
        // console.log(data)
        toReturn[0]["title"] = data["items"][0]['title']
        toReturn[0]["start_time"] = data["items"][0]['start']
        toReturn[0]["end_time"] = data["items"][0]['end']
        toReturn[0]["duration"] = data["items"][0]['duration']
        // If ['category'] is null set to Other
        toReturn[0]["category"] = data["items"][0]['category'] ? data["items"][0]['category'] : "Other"

        toReturn[1]["title"] = data["items"][1]['title']
        toReturn[1]["start_time"] = data["items"][1]['start']
        toReturn[1]["end_time"] = data["items"][1]['end']
        toReturn[1]["duration"] = data["items"][1]['duration']
        // If ['category'] is null set to Other
        toReturn[1]["category"] = data["items"][1]['category'] ? data["items"][1]['category'] : "Other"
        


        return {
            statusCode: 200,
            body: JSON.stringify(toReturn)
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
