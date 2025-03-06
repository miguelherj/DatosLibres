let datosProcesados = [];
let chart = null;

async function cargarCSV() {
    try {
        const response = await fetch("datos.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                datosProcesados = results.data.map(row => ({
                    edad: parseInt(row["Edad"]) || 0,
                    genero: row["Genero"] ? row["Genero"].trim().toLowerCase() : "",
                    caracteristica_victima: row["Características de la victima"] ? row["Características de la victima"].trim().toLowerCase() : "",
                    clase_accidente: row["Clase de Accidente"] ? row["Clase de Accidente"].trim().toLowerCase() : "",
                    vehiculo_victima: row["Vehiculo de la Victima"] ? row["Vehiculo de la Victima"].trim().toLowerCase() : "",
                    vehiculo_contraparte: row["Vehiculo 2 de la contraparte"] ? row["Vehiculo 2 de la contraparte"].trim().toLowerCase() : ""
                }));
            }
        });
    } catch (error) {
        console.error("Error al cargar el CSV:", error);
    }
}

cargarCSV();

function mostrarGrafico(id) {
    const edad = document.getElementById("edad").value;
    const genero = document.getElementById("genero").value;

    // Filtrar por edad y género
    const datosFiltrados = datosProcesados.filter(row => 
        (edad === "" || row.edad == edad) &&
        (genero === "" || row.genero == genero)
    );

    if (datosFiltrados.length === 0) {
        document.getElementById("mensaje").style.display = "block";
        if (chart) chart.destroy();
        return;
    } else {
        document.getElementById("mensaje").style.display = "none";
    }

    const filtro = datosFiltrados.reduce((acc, row) => {
        acc[row[id]] = (acc[row[id]] || 0) + 1;
        return acc;
    }, {});

    crearGrafico("grafico", filtro);
}

function actualizarGrafico() {
    mostrarGrafico("caracteristica_victima");
}

function crearGrafico(id, datos) {
    const ctx = document.getElementById(id).getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(datos),
            datasets: [{
                label: id.replace("_", " "),
                data: Object.values(datos),
                backgroundColor: ["blue", "green", "red", "purple", "orange"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
