const { createClient } = require('@supabase/supabase-js');

// Ahora las variables están disponibles en process.env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('alumnos').select('*');
    if (error) return res.status(500).json({ error });
    res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre, apellido } = req.body;
    const { data, error } = await supabase.from('alumnos').insert([{ nombre, apellido }]);
    if (error) return res.status(500).json({ error });
    res.status(200).json(data[0]);
  }
};
