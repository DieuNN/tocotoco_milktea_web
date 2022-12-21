window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
    const pendingTable = document.getElementById("pendingOrdersTable")
    if (pendingTable) {
        new simpleDatatables.DataTable(pendingTable)
    }
    const pendingTable2 = document.getElementById("pendingOrdersTable2")
    if (pendingTable) {
        new simpleDatatables.DataTable(pendingTable2)
    }
    const notificationsTable = document.getElementById("notificationsTable")
    if (notificationsTable) {
        new simpleDatatables.DataTable(notificationsTable)
    }
});
