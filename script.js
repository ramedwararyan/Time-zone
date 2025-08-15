const API_KEY = "8b4a3a03be7343ee9551af19c37be83d";

navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.features.length) {
                const props = data.features[0].properties;
                document.getElementById('curr-name').textContent = props.timezone.name;
                document.getElementById('curr-lat').textContent = lat;
                document.getElementById('curr-lon').textContent = lon;
                document.getElementById('curr-std').textContent = props.timezone.offset_STD;
                document.getElementById('curr-std-sec').textContent = props.timezone.offset_STD_seconds;
                document.getElementById('curr-dst').textContent = props.timezone.offset_DST;
                document.getElementById('curr-dst-sec').textContent = props.timezone.offset_DST_seconds;
                document.getElementById('curr-country').textContent = props.country;
                document.getElementById('curr-postcode').textContent = props.postcode;
                document.getElementById('curr-city').textContent = props.city;
            }
        });
}, err => {
    document.getElementById('curr-name').textContent = "Location access denied";
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const address = document.getElementById('address').value.trim();
    const errorDiv = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');

    errorDiv.textContent = "";
    resultSection.style.display = "none";

    if (!address) {
        errorDiv.textContent = "Please enter an address";
        return;
    }

    fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.features.length) {
                const props = data.features[0].properties;
                if (props.timezone) {
                    document.getElementById('res-name').textContent = props.timezone.name;
                    document.getElementById('res-lat').textContent = props.lat;
                    document.getElementById('res-lon').textContent = props.lon;
                    document.getElementById('res-std').textContent = props.timezone.offset_STD;
                    document.getElementById('res-std-sec').textContent = props.timezone.offset_STD_seconds;
                    document.getElementById('res-dst').textContent = props.timezone.offset_DST;
                    document.getElementById('res-dst-sec').textContent = props.timezone.offset_DST_seconds;
                    document.getElementById('res-country').textContent = props.country;
                    document.getElementById('res-postcode').textContent = props.postcode;
                    document.getElementById('res-city').textContent = props.city;
                    resultSection.style.display = "block";
                } else {
                    errorDiv.textContent = "Timezone could not be found";
                }
            } else {
                errorDiv.textContent = "Timezone could not be found";
            }
        })
        .catch(() => {
            errorDiv.textContent = "Error fetching data";
        });
});