// --------------------------------------------
// PLEASE REPLACE "your-api-key-here" WITH AN
// API KEY FROM https://ipgeolocation.io/
// --------------------------------------------


let apiKey = "YOUR API KEY";

window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    console.log(iceCandidate.candidate);
    const ip = fields[4];
    if (fields[7] === "srflx") {
      getLocation(ip);
    }

    if (fields[7] === 'srflx') {
      console.log('IP Address:', fields[4])
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};




let getLocation = async (ip) => {
  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

  await fetch(url).then((response) =>
    response.json().then((json) => {
      const output = `
          ---------------------
          Country: ${json.country_name}
          State: ${json.state_prov}
          City: ${json.city}
          District: ${json.district}
          Lat / Long: (${json.latitude}, ${json.longitude})
          IP Address: ${json.ip.address}
          ---------------------
          `;
      console.log(output);
    })
  );
};
