import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// @desc    Get AI health summary
// @route   POST /api/ai/summary
// @access  Private
export const getAISummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;

    // Get recent records
    const { data: records, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    if (!records || records.length === 0) {
      res.json({ summary: 'Not enough data available yet. Please record some health vitals first.' });
      return;
    }

    const avgHeartRate = Math.round(records.reduce((s, r) => s + r.heart_rate, 0) / records.length);
    const avgSpo2 = Math.round(records.reduce((s, r) => s + r.spo2, 0) / records.length);
    const avgSystolic = Math.round(records.reduce((s, r) => s + r.blood_pressure_systolic, 0) / records.length);
    const avgDiastolic = Math.round(records.reduce((s, r) => s + r.blood_pressure_diastolic, 0) / records.length);
    const avgTemp = (records.reduce((s, r) => s + Number(r.temperature), 0) / records.length).toFixed(1);

    const prompt = `You are a professional medical AI assistant. Based on the following average health vitals of a patient over the last ${records.length} readings, provide:
1. A brief health summary (2-3 sentences)
2. Any potential risks or concerns
3. Lifestyle recommendations (2-3 bullet points)

Vitals:
- Average Heart Rate: ${avgHeartRate} bpm
- Average SpO2 (Oxygen): ${avgSpo2}%
- Average Blood Pressure: ${avgSystolic}/${avgDiastolic} mmHg
- Average Temperature: ${avgTemp}°F

Keep your response concise, professional, and easy for a patient to understand. Do not diagnose but advise to see a doctor if needed.`;

    const useGroq = !!process.env.GROQ_API_KEY;
    let summary = '';

    if (useGroq) {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });
      summary = completion.choices[0]?.message?.content || 'Unable to generate summary.';
    } else {
      // Fallback rule-based summary if no AI key is provided
      const concerns = [];
      if (avgHeartRate > 100) concerns.push('elevated heart rate');
      if (avgSpo2 < 95) concerns.push('low oxygen saturation');
      if (avgSystolic > 130) concerns.push('high blood pressure');
      if (Number(avgTemp) > 99.5) concerns.push('elevated body temperature');

      summary = concerns.length > 0
        ? `⚠️ Your recent health data shows some concerns: ${concerns.join(', ')}. Please consult a healthcare professional. Stay hydrated, rest well, and monitor your vitals regularly.`
        : `✅ Your recent health vitals look generally within normal ranges. Heart Rate: ${avgHeartRate} bpm, SpO2: ${avgSpo2}%, BP: ${avgSystolic}/${avgDiastolic} mmHg. Keep maintaining a healthy lifestyle!`;
    }

    res.json({ summary, vitalsUsed: { avgHeartRate, avgSpo2, avgSystolic, avgDiastolic, avgTemp } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
