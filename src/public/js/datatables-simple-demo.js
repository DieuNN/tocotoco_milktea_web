window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
    const pendingTable = document.getElementById("pendingOrdersTable")
    console.log(pendingTable)
    if (pendingTable) {
        new simpleDatatables.DataTable(pendingTable)
    }
});
