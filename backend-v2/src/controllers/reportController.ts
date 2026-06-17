import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import PDFDocument from 'pdfkit';

// @desc    Generate PDF health report
// @route   GET /api/reports/generate
// @access  Private
export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;

    // Fetch recent health records
    const { data: records, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=LifeLink_Report_${Date.now()}.pdf`);
    doc.pipe(res);

    // === HEADER ===
    doc.rect(0, 0, doc.page.width, 80).fill('#0ea5e9');
    doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('LifeLink', 50, 25);
    doc.fontSize(12).font('Helvetica').text('Smart Health Monitoring Report', 50, 57);
    doc.moveDown(3);

    // === USER INFO ===
    doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text('Patient Information', 50, 100);
    doc.moveTo(50, 122).lineTo(545, 122).strokeColor('#e2e8f0').stroke();
    doc.fontSize(12).font('Helvetica').fillColor('#334155');
    doc.text(`Name: ${userProfile?.full_name || 'N/A'}`, 50, 130);
    doc.text(`Email: ${userProfile?.email || 'N/A'}`, 50, 150);
    doc.text(`Age: ${userProfile?.age || 'N/A'}`, 50, 170);
    doc.text(`Blood Group: ${userProfile?.blood_group || 'N/A'}`, 50, 190);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 50, 210);
    doc.moveDown(2);

    if (records && records.length > 0) {
      // === AVERAGES SUMMARY ===
      const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
      const avgHR = avg(records.map(r => r.heart_rate));
      const avgSpo2 = avg(records.map(r => r.spo2));
      const avgSys = avg(records.map(r => r.blood_pressure_systolic));
      const avgDia = avg(records.map(r => r.blood_pressure_diastolic));
      const avgTemp = (records.reduce((s, r) => s + Number(r.temperature), 0) / records.length).toFixed(1);

      doc.fontSize(18).font('Helvetica-Bold').fillColor('#0f172a').text('Health Summary', 50, 245);
      doc.moveTo(50, 267).lineTo(545, 267).strokeColor('#e2e8f0').stroke();

      const drawMetric = (label: string, value: string, status: string, x: number, y: number) => {
        const color = status === 'Normal' ? '#16a34a' : '#dc2626';
        doc.roundedRect(x, y, 230, 65, 8).fillAndStroke('#f8fafc', '#e2e8f0');
        doc.fillColor('#64748b').fontSize(10).font('Helvetica').text(label, x + 12, y + 10);
        doc.fillColor('#0f172a').fontSize(22).font('Helvetica-Bold').text(value, x + 12, y + 25);
        doc.fillColor(color).fontSize(9).font('Helvetica').text(status, x + 12, y + 50);
      };

      drawMetric('Heart Rate', `${avgHR} bpm`, avgHR > 100 || avgHR < 60 ? 'Abnormal' : 'Normal', 50, 278);
      drawMetric('Oxygen Level (SpO2)', `${avgSpo2}%`, avgSpo2 < 95 ? 'Low' : 'Normal', 310, 278);
      drawMetric('Blood Pressure', `${avgSys}/${avgDia} mmHg`, avgSys > 130 ? 'High' : 'Normal', 50, 358);
      drawMetric('Body Temperature', `${avgTemp}°F`, Number(avgTemp) > 99.5 ? 'High' : 'Normal', 310, 358);

      // === RECORDS TABLE ===
      doc.addPage();
      doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text('Detailed Health Records', 50, 50);
      doc.moveTo(50, 72).lineTo(545, 72).strokeColor('#e2e8f0').stroke();

      const headers = ['Date & Time', 'Heart Rate', 'SpO2', 'BP', 'Temp'];
      const colWidths = [160, 80, 60, 100, 80];
      let currentX = 50;
      let currentY = 85;

      // Table header
      doc.rect(50, currentY, 495, 22).fill('#0ea5e9');
      headers.forEach((h, i) => {
        doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(h, currentX + 5, currentY + 6, { width: colWidths[i] });
        currentX += colWidths[i];
      });
      currentY += 22;

      // Table rows
      records.slice(0, 15).forEach((r, idx) => {
        const rowColor = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        doc.rect(50, currentY, 495, 20).fill(rowColor);
        currentX = 50;
        const cells = [
          new Date(r.recorded_at).toLocaleString(),
          `${r.heart_rate} bpm`,
          `${r.spo2}%`,
          `${r.blood_pressure_systolic}/${r.blood_pressure_diastolic}`,
          `${r.temperature}°F`
        ];
        cells.forEach((cell, i) => {
          doc.fillColor('#334155').fontSize(9).font('Helvetica').text(cell, currentX + 5, currentY + 5, { width: colWidths[i] });
          currentX += colWidths[i];
        });
        currentY += 20;
      });
    } else {
      doc.fillColor('#64748b').fontSize(14).text('No health records found. Start monitoring to generate a full report.', 50, 250);
    }

    // === FOOTER ===
    doc.fillColor('#94a3b8').fontSize(9).text('Generated by LifeLink Health Monitoring System — For informational purposes only. Consult a physician for medical advice.', 50, doc.page.height - 40, { align: 'center' });

    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
