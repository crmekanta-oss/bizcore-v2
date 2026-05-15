import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export const exportToPDF = (title, columns, rows) => {
  try {
    const doc = new jsPDF()
    
    // Ensure data is clean for PDF
    const tableColumn = columns.map(col => col.label)
    const tableRows = rows.map(row => 
      columns.map(col => {
        const val = row[col.key];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    )

    doc.text(title, 14, 15)
    doc.setFontSize(10)
    doc.text(`Export Date: ${new Date().toLocaleString()}`, 14, 22)

    // Call autoTable directly as a function, passing the doc instance
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [59, 130, 246] }
    })

    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_export.pdf`)
  } catch (error) {
    console.error("PDF Export Detailed Error:", error)
    alert("PDF Export failed: " + error.message)
  }
}

export const exportToExcel = (title, columns, rows) => {
  const tableRows = rows.map(row => {
    const rowData = {}
    columns.forEach(col => {
      rowData[col.label] = row[col.key]
    })
    return rowData
  })

  const worksheet = XLSX.utils.json_to_sheet(tableRows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '_')}_export.xlsx`)
}
