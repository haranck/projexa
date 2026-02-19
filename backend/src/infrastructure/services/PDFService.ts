import PDFDocument from 'pdfkit';
import { AdminPaymentResponseDTO } from '../../application/dtos/admin/responseDTOs/AdminPaymentResponseDTO';

export class PDFService {
    async generateSalesReportPDF(payments: AdminPaymentResponseDTO[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                doc.fontSize(20).font('Helvetica-Bold').text('Sales Report', { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: 'center' });
                doc.fontSize(10).text(`Total Records: ${payments.length}`, { align: 'center' });
                doc.moveDown(1);

                const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
                doc.fontSize(12).font('Helvetica-Bold').text(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, { align: 'center' });
                doc.moveDown(1.5);

                const tableTop = doc.y;
                const colWidths = {
                    date: 70,
                    customer: 80,
                    workspace: 90,
                    amount: 70,
                    status: 50,
                    invoice: 90,
                    method: 70
                };

                let xPos = 50;

                doc.fontSize(9).font('Helvetica-Bold');
                doc.text('Date', xPos, tableTop, { width: colWidths.date, align: 'left' });
                xPos += colWidths.date;
                doc.text('Customer', xPos, tableTop, { width: colWidths.customer, align: 'left' });
                xPos += colWidths.customer;
                doc.text('Workspace', xPos, tableTop, { width: colWidths.workspace, align: 'left' });
                xPos += colWidths.workspace;
                doc.text('Amount', xPos, tableTop, { width: colWidths.amount, align: 'right' });
                xPos += colWidths.amount;
                doc.text('Status', xPos, tableTop, { width: colWidths.status, align: 'center' });
                xPos += colWidths.status;
                doc.text('Invoice No', xPos, tableTop, { width: colWidths.invoice, align: 'left' });
                xPos += colWidths.invoice;
                doc.text('Method', xPos, tableTop, { width: colWidths.method, align: 'left' });

                doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

                let yPos = tableTop + 25;
                doc.font('Helvetica').fontSize(8);

                payments.forEach((payment, index) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }

                    xPos = 50;

                    const date = new Date(payment.paidAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                    doc.text(date, xPos, yPos, { width: colWidths.date, align: 'left' });
                    xPos += colWidths.date;

                    doc.text(payment.userName, xPos, yPos, { width: colWidths.customer, align: 'left', ellipsis: true });
                    xPos += colWidths.customer;

                    doc.text(payment.workspaceName, xPos, yPos, { width: colWidths.workspace, align: 'left', ellipsis: true });
                    xPos += colWidths.workspace;

                    const amount = `₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                    doc.text(amount, xPos, yPos, { width: colWidths.amount, align: 'right' });
                    xPos += colWidths.amount;

                    doc.text(payment.status, xPos, yPos, { width: colWidths.status, align: 'center' });
                    xPos += colWidths.status;

                    doc.text(payment.invoiceId.slice(0, 15) + '...', xPos, yPos, { width: colWidths.invoice, align: 'left' });
                    xPos += colWidths.invoice;

                    doc.text(payment.paymentMethod, xPos, yPos, { width: colWidths.method, align: 'left', ellipsis: true });

                    yPos += 20;

                    if ((index + 1) % 5 === 0) {
                        doc.moveTo(50, yPos - 5).lineTo(545, yPos - 5).strokeOpacity(0.2).stroke().strokeOpacity(1);
                    }
                });

                const pageCount = doc.bufferedPageRange().count;
                for (let i = 0; i < pageCount; i++) {
                    doc.switchToPage(i);
                    doc.fontSize(8).text(
                        `Page ${i + 1} of ${pageCount}`,
                        50,
                        doc.page.height - 50,
                        { align: 'center' }
                    );
                }

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}
