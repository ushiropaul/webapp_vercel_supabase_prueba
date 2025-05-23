const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('alumnos').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { nombre, apellido } = req.body;
      const { data, error } = await supabase.from('alumnos').insert([{ nombre, apellido }]);
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error en API /api/alumnos:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
};
