var map = null;
var infoWindow = null;
var markers = [];
var $el = $(".static.stores");

$(function(){
    if (mapInit() === true) {
        console.log("stores loaded");
    }
});

function mapInit() {

    var $acceptedHref = window.location.href;

    if ($acceptedHref.indexOf('Tiendas') > -1) {
        // var $pais = $("#pais option:eq(1):contains('Chile')");
        loadScript();
        setInterval(function () {
            // $('#pais').change();
            $('#bodyContent p, #ciudad option').each(function () {
                var $this = $(this);
                $this.text($this.text().replace(/_/g, ' '));
            });
            // $('.tiendas .resultado .tiendas-resultado, .tiendas .resultado .tiendas-info').css("display","block");
        }, 1000);

    }

    return true;
}

function loadScript() {

    /* colorear cuadro */
    var color = $(".produto .dimension-Color").text(),
        script = document.createElement('script'),
        $results = $(".store__results"),
        pais = '';

    $(".produto .dimension-Color").css("color", "#" + color);
    $(".produto .dimension-Color").css("background", "#" + color);

    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDzzSgYRacD6Rzn9EmHMPGD3gdZljh0tpk&sensor=false' + '&callback=initialize';
    document.body.appendChild(script);

    deleteGoogleMapMessage();
    getStores();

    $(".stores_ul ul li").on('click', function () {

        var store_name = $(this).attr('id');
        var attributes = $(this).attr('rel');
        setStoreMap(store_name, attributes);
        $(".stores_ul ul li").removeClass('selected');
        $(this).addClass('selected');

    });

    $('#pais').on('change', function () {
        pais = $(this).val();
        // getMarkersByCountry(pais);
        getCities(pais);
    });

    $('#ciudad').on('change', function () {

        var ciud = $(this).val(),
            $storeWarning = $(".store__warning");

        addMarkersOfCity(ciud, pais, map);

        $('.ciudad').hide();
        $storeWarning.fadeOut();

        // Se muestran los options de las tiendas a partir de la ciudad actual se utiliza la clase
        if (ciud.indexOf('Escoja una ciudad') > -1) {
            $storeWarning.fadeIn();
            $results.fadeOut();
        } else {
            $results.fadeIn().css("display", "flex");
        }
        $('.' + ciud.replace(" ", "")).show();

    });

    $('#pais').change();
}

function initialize() {

    map = initializeMap();
    deleteGoogleMapMessage();
    deleteMarkers();

    ciudad = getParametroUrl("ciudad");
    pais = getParametroUrl("pais");
    markerFound = false;

    if (ciudad != "" && (pais == null || pais == "")) {

        // Solo para Chile se envia como parametro la ciudad
        markerFound = addMarkersOfCity(ciudad, "Chile", map);

    } else if (ciudad != null && ciudad != "" && pais != null && pais != "") {

        // Solo para Chile se envia como parametro la ciudad
        markerFound = addMarkersOfCity(ciudad, pais, map);

    } else if (pais != "" && (ciudad == null || ciudad == "")) {

        // Se ubican las tiendas del pais
        markerFound = getMarkersByCountry(pais);

    }

    if (!markerFound) {

        // Por defecto se ubican las tiendas de Chile
        getMarkersByCountry("Chile");

    }

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        deleteGoogleMapMessage();
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        deleteGoogleMapMessage();
    });

}

function deleteGoogleMapMessage() {

    firstGmnoPrint = $(".gmnoprint").first();
    nextfirstGmnoPrint = firstGmnoPrint.next();
    nextfirstGmnoPrint.remove();

}

function getParametroUrl(paramName) {

    paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + paramName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var href = window.location.href;
    href = href.replace(/&amp;/g, '&');
    var results = regex.exec(href);

    if (results == null) {

        return "";
    } else {

        return decodeURIComponent(results[1]);

    }

}

function initializeMap() {

    var mapOptions = {

        center: new google.maps.LatLng(-22.913885, -43.7261816),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    return map;

}

function getAutoCompleteValues() {

    data = getAllData();
    values = [];

    $.each(data, function (countryName, countryVal) {

        countryObj = {};
        countryObj.id = countryName;
        countryObjValue = {};
        countryObjValue.type = "Country";
        countryObjValue.country = countryName;
        countryObj.value = countryObjValue;
        countryObj.label = countryName;
        values.push(countryObj);

        $.each(countryVal.cities, function (cityName, cityVal) {

            cityObj = {};
            cityObj.id = cityName + ", " + countryName;
            cityObjValue = {};
            cityObjValue.type = "City";
            cityObjValue.country = countryName;
            cityObjValue.city = cityName;
            cityObj.value = cityObjValue;
            cityObj.label = cityName + ", " + countryName;

            values.push(cityObj);

            $.each(cityVal.stores, function (storeName, storeVal) {
                storeObj = {};
                storeObj.id = storeName;
                storeObjValue = {};
                storeObjValue.type = "Store";
                storeObjValue.country = countryName;
                storeObjValue.city = cityName;
                storeObj.value = storeObjValue;
                storeObj.label = storeName;

                values.push(storeObj);

            });

        });

    });

    return values;

}

/* test */

function getStores() {

    data = getAllData();
    values = [];
    var UL = $('<ul/>');
    // var opt = $('<option>').val('Seleccione su país').text('Seleccione su país');
    // $('#pais').append(opt);

    $.each(data, function (countryName, countryVal) {

        var opt2 = $('<option>').val(countryName).text(countryName);
        $('#pais').append(opt2);

        $.each(countryVal.cities, function (cityName, cityVal) {

            $.each(cityVal.stores, function (storeName, storeVal) {

                storeObj = {};
                storeObj.id = storeName;
                storeObjValue = {};
                storeObjValue.type = "Store";
                storeObjValue.country = countryName;
                storeObjValue.city = cityName;
                storeObj.value = storeObjValue;
                storeObj.label = storeName;

                values.push(storeObj);
                var LI = $('<li/>').text(storeName).attr('id', storeName).attr('rel', cityName + ',' + countryName).addClass(cityName).addClass('ciudad');
                UL.append(LI);

            });

        });

    });

    $(".stores_ul").append(UL);
    //console.log(values);
}

function getCities(pais) {

    data = getAllData();
    values = [];
    var UL = $('<ul/>');

    $.each(data, function (countryName, countryVal) {

        $.each(countryVal.cities, function (cityName, cityVal) {

            if (countryName == pais) {
                values.push(cityName);
            }

        });

    });

    $('#ciudad').html('');

    var opt = $('<option>').val('Escoja una ciudad').text('Escoja una ciudad');

    $('#ciudad').append(opt);

    $.each(values, function (index, value) {

        var opt2 = $('<option>').val(value).text(value);
        $('#ciudad').append(opt2);

    });

}

function setStoreMap(store, atrtibutes) {

    data = atrtibutes.split(',');
    city = data[0];
    country = data[1];
    addMarkersOfStore(store, city, country, map);

}

function getMarkersByCountry(country) {

    data = getAllData();
    objCountry = data[country];
    if (objCountry != null) {

        $.each(objCountry.cities, function (cityName, city) {

            $.each(city.stores, function (storeName, store) {

                var latLng = new google.maps.LatLng(store.lat, store.lng),
                    title = storeName,
                    marker = addMarker(latLng, title, map);

                google.maps.event.addListener(marker, 'click', function () {

                    map.setCenter(latLng);

                    if (infoWindow) {

                        infoWindow.close();
                        infoWindow = null;
                    }

                    infoWindow = new google.maps.InfoWindow({

                        content: getContentString(store, storeName, cityName, country)
                    });

                    infoWindow.open(map, marker);
                    setSelectedStore(store, storeName, cityName, country);

                });

            });

        });

        countryLatLng = new google.maps.LatLng(objCountry.lat, objCountry.lng);
        map.setCenter(countryLatLng);
        map.setZoom(5);
        return true;
    } else {

        return false;

    }

}

function addMarkersOfCity(cityName, country, map) {

    clearSelectedStore();
    data = getAllData();
    city = data[country].cities[cityName];
    if (city != null) {

        // Se recorren todas las tiendas de la ciudad
        $.each(city.stores, function (storeName, store) {

            var latLng = new google.maps.LatLng(store.lat, store.lng),
                title = storeName,
                marker = addMarker(latLng, title, map);

            google.maps.event.addListener(marker, 'click', function () {

                map.setCenter(latLng);

                if (infoWindow) {

                    infoWindow.close();
                    infoWindow = null;
                }

                infoWindow = new google.maps.InfoWindow({

                    content: getContentString(store, storeName, cityName, country)

                });

                infoWindow.open(map, marker);
                setSelectedStore(store, storeName, cityName, country);

            });

        });

        // Se fija el centro en la ciudad y se hace un zoom menos profundo
        //cityLatLng = getCityLocation( cityName, country, cityLocationCallBack );
        cityLatLng = new google.maps.LatLng(city.lat, city.lng);
        map.setCenter(cityLatLng);
        map.setZoom(12);

        return true;
    } else {

        return false;

    }

}

function cityLocationCallBack(location) {
    return location;
}

function addMarkersOfStore(store, city, country, map) {

    var data = getAllData(),
        stores = data[country].cities[city].stores,
        storeObj = stores[store],
        latLng = new google.maps.LatLng(storeObj.lat, storeObj.lng),
        title = store;

    marker = addMarker(latLng, title, map);
    map.setCenter(latLng);
    map.setZoom(16);
    setSelectedStore(storeObj, title, city, country);

    google.maps.event.addListener(marker, 'click', function () {

        map.setCenter(latLng);

        if (infoWindow) {

            infoWindow.close();
            infoWindow = null;

        }

        infoWindow = new google.maps.InfoWindow({

            content: getContentString(storeObj, title, city, country)

        });

        infoWindow.open(map, marker);
        setSelectedStore(storeObj, title, city, country);

    });

}

function getContentString(store, storeName, city, country) {

    var contentString = '<div id="content"><div id="siteNotice"></div><h2 id="firstHeading" class="firstHeading">' + storeName + '</h2><div id="bodyContent"><div class="bodyContent__text"><strong>Ciudad: </strong><p> ' + city + '</p></div><div class="bodyContent__text"><strong>Pais: </strong> <p>' + country + '</p></div>' + (store.address != null && $.trim(store.address) != "" ? '<div class="bodyContent__text"><strong>Dirección: </strong><p>' + store.address + '</p></div>' : '') + (store.phone != null && $.trim(store.phone) != "" ? '<div class="bodyContent__text"><strong>Teléfono: </strong><p>' + store.phone + '</p></div>' : '') + (store.schedules != null && $.trim(store.schedules) != "" ? '<div class="bodyContent__text"><strong>Horários: </strong><p>' + store.schedules + '</p></div>' : '') + '</div>' + '</div>';

    return contentString;

}

function clearSelectedStore() {
    $("#storeContent").empty();
}

function setSelectedStore(store, storeName, city, country) {

    contentString = getContentString(store, storeName, city, country);
    $("#storeContent").empty();
    $("#storeContent").append(contentString);

}

function markerImage() {
    return "/arquivos/pin-in-the-map.png";
}

// Add a marker to the map and push to the array.
function addMarker(latLng, title, map) {

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
        // icon :  markerImage()
    });
    markers.push(marker);
    return marker;
}

// Sets the map on all markers in the array.
function setAllMap(map) {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }

}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {

    setAllMap(null);

}

// Shows any markers currently in the array.
function showMarkers() {

    setAllMap(map);

}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {

    clearMarkers();
    markers = [];

}

function getAllData() {
    var data = {
        Chile: {
            lat: -31.8335421,
            lng: -69.5784968,
            cities: {
                Antofagasta: {
                    lat: '-23.6468175',
                    lng: '-70.4015988',
                    stores: {
                        'Mall Plaza Antofagasta': {
                            lat: -23.6460605,
                            lng: -70.4030107,
                            address: 'Av. Balmaceda 2337 Local 162 , Antofagasta',
                            phone: '(+56 55 2533214)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Calama: {
                    lat: '-22.4492016',
                    lng: '-68.9226407',
                    stores: {
                        'Plaza Calama': {
                            lat: -22.4497402,
                            lng: -68.92372,
                            address: 'Av. Balmaceda 3242, Local B-149, Calama',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Temuco: {
                    lat: '-38.7354803',
                    lng: '-72.6104482',
                    stores: {
                        'Portal Temuco': {
                            lat: -38.7349423,
                            lng: -72.613005,
                            address: 'Av Alemania 0671, Local 2067, Temuco',
                            phone: '(+56 45 2211712)',
                            //schedules: 'Lunes a Domingo:'  
                        }
                    }
                },
                Copiapó: {
                    lat: '-27.3683877',
                    lng: '-70.3397467',
                    stores: {
                        'Mall Plaza Copiapó': {
                            lat: -27.3705101,
                            lng: -70.3414024,
                            address: 'Maipú 0110, Local A-1077, Copiapó',
                            phone: '(+56 52 2356678)',
                            //schedules: 'Lunes a Domingo:' 
                        }
                    }
                },
                Chillán: {
                    lat: '-36.6099335',
                    lng: '-72.1018979',
                    stores: {
                        'Mall Arauco Chillán': {
                            lat: -36.6094189,
                            lng: -72.1027439,
                            address: 'El Roble 770, Local 214, Chillán',
                            phone: '(+56 42 2229380)',
                            //schedules: 'Lunes a Domingo:' 
                        }
                    }
                },
                Talcahuano: {
                    lat: '-36.7130683',
                    lng: '-73.114394',
                    stores: {
                        'Portal Talcahuano': {
                            lat: -36.7507253,
                            lng: -73.0951778,
                            address: 'Avda. Colón 180, Local 2011, Talcahuano',
                            phone: '(+56 41 2298010)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Concepción: {
                    lat: '-36.8222947',
                    lng: '-73.049383',
                    stores: {
                        'Concepción Centro': {
                            lat: -36.8248521,
                            lng: -73.0473283,
                            address: 'Av. Barros Arana 1068 ,Local 07 - 01, Concepción',
                            phone: '(+56 41 3162175)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Aeropuerto Concepción': {
                            lat: -36.7802354,
                            lng: -73.0608969,
                            address: 'Avda. J.Alessandri 3177, Local A121, Concepción',
                            phone: '(+56 41 2563776)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'Los Angeles': {
                    lat: '-37.4684275',
                    lng: '-72.3524444',
                    stores: {
                        'MultiOutlet Los Angeles': {
                            lat: -37.4683372,
                            lng: -72.3549975,
                            address: 'Calle Valdivia 440, Local A-310, Los Ángeles',
                            phone: '(+56 43 2451105)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'La Serena': {
                    lat: '-29.911686',
                    lng: '-71.2583681',
                    stores: {
                        'Mall Plaza La Serena': {
                            lat: -29.9125806,
                            lng: -71.2604689,
                            address: 'Avda. Alberto Solari 1400, Local A 113, La Serena',
                            phone: '(+56 51 2471666)',
                            //schedules: 'Lunes a Domingo:'
                        },
                    }
                },
                Ovalle: {
                    lat: '-30.5978764',
                    lng: '-71.1852196',
                    stores: {
                        'Open Plaza Ovalle': {
                            lat: -30.5975125,
                            lng: -71.1881082,
                            address: 'Prolongación Benavente 1075, Local 1230, Ovalle',
                            phone: '(+56 53 2595041)',
                            //schedules: 'Lunes a Domingo:'
                        },
                    }
                },
                Coquimbo: {
                    lat: '-29.9595371',
                    lng: '-71.3389398',
                    stores: {
                        'Mall Vivo': {
                            lat: -29.9594766,
                            lng: -71.3368242,
                            address: 'Baquedano 86, Local 1244-1248, Coquimbo',
                            //phone: '(+56 97504526)',
                            //schedules: 'Lunes a Domingo:'
                        },
                    }
                },
                Rancagua: {
                    lat: '-34.1631201',
                    lng: '-70.7533766',
                    stores: {
                        'Mall Open rancagua': {
                            lat: -34.1690644,
                            lng: -70.7416069,
                            address: 'José Bernardo Cuevas 483, Local 118, Rancagua',
                            phone: '(+56 72 2242761)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Portal Rancagua': {
                            lat: -34.1849507,
                            lng: -70.7266552,
                            address: 'Carretera El Cobre 750, Local 1029, Rancagua',
                            phone: '(+56 72 2210805)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'San Fernando': {
                    lat: '-34.5861559',
                    lng: '-70.9850177',
                    stores: {
                        'Mall VIVO San Fernando': {
                            lat: -34.586671,
                            lng: -70.987404,
                            address: 'Av. Bernardo O´Higgins 701, Local 1228,',
                            phone: '(+56 229018712)',
                            //schedules: 'Lunes a Domingo:'
                        },
                    }
                },
                Osorno: {
                    lat: '-40.5738309',
                    lng: '-73.1304588',
                    stores: {
                        'Mall Portal Osorno': {
                            lat: -40.5738537,
                            lng: -73.1325179,
                            address: 'Plaza Yungay 609, Local 2044, Osorno',
                            phone: '(+56 64 2244410)',
                            //schedules: 'Lunes a Domingo:'
                        },
                    }
                },
                'Puerto Montt': {
                    lat: '-41.4639598',
                    lng: '-72.9577501',
                    stores: {
                        'Mall Paseo Costanera': {
                            lat: -41.4722624,
                            lng: -72.9386182,
                            address: 'Illapel 10, Local 106A, Puerto Montt',
                            phone: '(+56 65 2344390)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Paseo del Mar': {
                            lat: -41.4717265,
                            lng: -72.9453413,
                            address: 'Urmeneta 580, Local 212, Puerto Montt',
                            phone: '(+56 65 2314863)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'Puerto Varas': {
                    lat: '-41.3192328',
                    lng: '-72.9856822',
                    stores: {
                        'Mall Paseo Puerto Varas': {
                            lat: -41.3192982,
                            lng: -72.9877923,
                            address: 'San Francisco 666, Local 113, Puerto Varas',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Valdivia: {
                    lat: '-39.8136738',
                    lng: '-73.2441252',
                    stores: {
                        'Centro Nuevo': {
                            lat: -39.8138643,
                            lng: -73.2462273,
                            address: 'Caupolican 465 Local 238, Valdivia',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Talca: {
                    lat: '-35.4272352',
                    lng: '-71.655484',
                    stores: {
                        'Mall Portal Centro': {
                            lat: -35.4274022,
                            lng: -71.6570713,
                            address: 'Uno Sur 1537 Local 119-120, Talca',
                            phone: '(+56 71 2216941)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Curicó: {
                    lat: '-34.9844271',
                    lng: '-71.242218',
                    stores: {
                        'Curicó': {
                            lat: -34.9843932,
                            lng: -71.2438494,
                            address: 'Peña 653-a, Curicó',
                            phone: '(+56 75 2222309)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Iquique: {
                    lat: '-20.2335767',
                    lng: '-70.1441655',
                    stores: {
                        'Mall plaza Iquique': {
                            lat: -20.2327283,
                            lng: -70.1449784,
                            address: 'Av. Héroes de la concepción 2555, Local 126, Iquique',
                            phone: '(+56 57 2561709)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'Los Andes': {
                    lat: '-32.8359031',
                    lng: '-70.6033923',
                    stores: {
                        'Espacios Urbanos': {
                            lat: -32.8359031,
                            lng: -70.6033923,
                            address: 'Santa Teresa 683, Local 26, Los Andes',
                            phone: '(+56 34 2408399)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Quilpué: {
                    lat: '-33.0437588',
                    lng: '-71.4210352',
                    stores: {
                        'Portal Belloto': {
                            lat: -33.0451417,
                            lng: -71.4234885,
                            address: 'Avda. Freire 2414, Local 1112, Quilpué',
                            phone: '(+56 32 2511148)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                'Viña del Mar': {
                    lat: '-33.0023297',
                    lng: '-71.5575503',
                    stores: {
                        'Galeria Lagomarsino': {
                            lat: -33.0247081,
                            lng: -71.5558857,
                            address: 'Avda. Valparaíso 617, Local 2, Viña del Mar',
                            phone: '(+56 32-2712053)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Marina Arauco': {
                            lat: -33.0088544,
                            lng: -71.5507501,
                            address: 'Avda. Libertad 1348, Local 013, Viña del Mar',
                            phone: '(+56 32 2683831)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Valparaiso: {
                    lat: '-33.0488611',
                    lng: '-71.6040598',
                    stores: {
                        'Mall Paseo Ross': {
                            lat: -33.048612,
                            lng: -71.606016,
                            address: 'Av. Argentina 540, Local 115-117, Valparaiso',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    }
                },
                Santiago: {
                    lat: '-33.4984511',
                    lng: '-70.7390928',
                    stores: {
                        'Estado': {
                            lat: -33.4396888,
                            lng: -70.6510426,
                            address: 'Huérfanos 864, Santiago',
                            phone: '(+56 22 5920110)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Huerfanos': {
                            lat: -33.4397835,
                            lng: -70.6540277,
                            address: 'Huérfanos 1052, Local 38, Santiago',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Matte': {
                            lat: -33.4391439,
                            lng: -70.6530469,
                            address: 'Ahumada 341, Local 921, Santiago',
                            phone: '(+56 22 6396314)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Ñuñoa': {
                            lat: -33.4622022,
                            lng: -70.6032484,
                            address: 'José Pedro Alessandri 1132 Local 2019, Santiago',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Quilin': {
                            lat: -33.487766,
                            lng: -70.577495,
                            address: 'Mar Tirreno 3349 Local 1100, Peñalolen',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Costanera': {
                            lat: -33.4177376,
                            lng: -70.6095237,
                            address: 'Av. Andrés Bello 2465, Local 3232, Providencia',
                            phone: '(+56 22 6189633)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Plaza Vespucio': {
                            lat: -33.5181206,
                            lng: -70.6020951,
                            address: 'Avda. Vicuña Mackenna 7110, Local 253, La Florida',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Plaza Egaña': {
                            lat: -33.4524377,
                            lng: -70.5716591,
                            address: 'Av. Larrain 5862, Local A-2024, La Reina',
                            phone: '(+56 22 8306146)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Tobalaba': {
                            lat: -33.478898,
                            lng: -70.7518089,
                            address: 'Americo Vespucio 399, Local 314 1er Nivel, Maipú',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Maipu': {
                            lat: -33.4813538,
                            lng: -70.7540419,
                            address: 'Americo Vespucio 399, Local 314 1er Nivel, Maipú',
                            phone: '(+56 22 7654881)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Apumanque': {
                            lat: -33.4095335,
                            lng: -70.569541,
                            address: 'Av. Manquehue Sur 31, Local 88, Las Condes',
                            phone: '(+56 22 2462025)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Alto Las Condes': {
                            lat: -33.3908833,
                            lng: -70.54839,
                            address: 'Av. Kennedy 9001, Local 3133, Las Condes',
                            phone: '(+56 22 5920288)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'San Bernardo': {
                            lat: -33.6316638,
                            lng: -70.71255,
                            address: 'Av. P.J.Alessandri 20040, Local A1047, San Bernardo',
                            phone: '(+56 22 8578090)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Plaza Norte': {
                            lat: -33.3662202,
                            lng: -70.6807182,
                            address: 'Av. Americo Vespucio 1737, Local 1040, Huechuraba',
                            phone: '(+56 22 5860523)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Outlet La Florida': {
                            lat: -33.5345153,
                            lng: -70.5725645,
                            address: 'Santa Delia 8937, Local #1508, La Florida',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Vivo Imperio': {
                            lat: -33.5345153,
                            lng: -70.5725645,
                            address: 'Agustinas 833, Local #880, Santiago',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Easton Buenav': {
                            lat: -33.5345153,
                            lng: -70.5725645,
                            address: 'Eduardo Frei Montalva 9709-9719, Local #518, Santiago',
                            //phone: '(+56 2)',
                            //schedules: 'Lunes a Domingo:'
                        },
                        'Parque Arauco': {
                            lat: -33.4021934,
                            lng: -70.5804381,
                            address: 'Av. Kennedy 5413, Local #160, Las Condes',
                            phone: '(+56 22 2420771)',
                            //schedules: 'Lunes a Domingo:'
                        }
                    },
                    Melipilla: {
                        lat: '-33.6851134',
                        lng: '-71.2162971',
                        stores: {
                            'Melipilla': {
                                lat: -33.6849676,
                                lng: -71.2158767,
                                address: 'Serrano 395, Local 216-217, Melipilla',
                                phone: '(+56 228320348)',
                                //schedules: 'Lunes a Domingo:'
                            }
                        }
                    },
                },


            }
        }
    };
    return data;
}