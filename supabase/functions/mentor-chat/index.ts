<!--pages / mentor.html-- >
    <!DOCTYPE html >
    <html lang="pt-BR" >
        <head>
        <meta charset="UTF-8" >
            <meta name="viewport" content = "width=device-width, initial-scale=1.0" >
                <title>Mentor IA — Empreendedores Exponenciais </title>

                    < !--Google Fonts-- >
                        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Outfit:wght@400;700;900&display=swap" rel = "stylesheet" >

                            <!--CSS Base-- >
                                <link rel="stylesheet" href = "../css/styles.css" >

                                    <style>
        :root {
    /* Cores padrão mentor (Modern Dark CSM) */
    --mentor - bg: #0a0a0f;
    --mentor - surface: #12121a;
    --mentor - accent: #E8B800; /* CSM Gold */
    --mentor - red: #C8181A;    /* CSM Red */
    --mentor - text: #eee8d5;
    --mentor - border: rgba(232, 184, 0, 0.2);
}

        body {
    font - family: 'Outfit', sans - serif;
    background: var(--mentor - bg);
    color: var(--mentor - text);
    transition: all 0.3s ease;
}

        /* HEADER PREMIUM */
        .header {
    background: rgba(18, 18, 26, 0.8);
    backdrop - filter: blur(10px);
    border - bottom: 2px solid var(--mentor - border);
    padding: 1.2rem 2rem;
    display: flex;
    align - items: center;
    gap: 1.5rem;
    position: sticky;
    top: 0;
    z - index: 100;
}

        .header - logo {
    font - size: 2rem;
    text - shadow: 0 0 20px var(--mentor - accent);
}

/* MODO NEOBRUTALISTA (OVERRIDE) */
body.neo - mode {
    background - color: var(--bg - primary)!important;
    background - image: radial - gradient(var(--dot - color) 1.5px, transparent 1.5px) !important;
    background - size: 30px 30px!important;
}

body.neo - mode.header {
    background: var(--bg - surface)!important;
    border - bottom: 5px solid var(--border - color)!important;
    box - shadow: 0 4px 0px var(--shadow - color)!important;
}

/* ... outros estilos mantidos para garantir o layout ... */
</style>
    </head>
    < !--O restante do body permanece com a lógica de chat que implementamos-- >
