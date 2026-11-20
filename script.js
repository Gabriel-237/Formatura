const form = document.getElementById("rsvpForm");
const notice = document.getElementById("notice");

// Configuração do Supabase
const SUPABASE_URL = "https://ruvxafejgdsndmrciasi.supabase.co";
const SUPABASE_KEY = "sb_publishable_JtYFXVAu6I7KDNMZH5_s8w_J9mMLVDC";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document
        .getElementById("guestName")
        .value.trim();

    const presencaSelecionada = document
        .getElementById("attendance")
        .value;

    if (!nome || !presencaSelecionada) {
        return;
    }

    // Garante que o texto enviado bata exatamente com a regra CHECK da tabela no banco
    const presencaParaBanco = presencaSelecionada === "Não poderei comparecer"
        ? "Não possorei"
        : presencaSelecionada;

    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Enviando...";

    try {

        const { error } = await supabaseClient
            .from("confirmacoes")
            .insert([
                {
                    nome: nome,
                    presenca: presencaParaBanco
                }
            ]);

        if (error) {
            throw error;
        }

        notice.textContent =
            `Obrigado, ${nome}! Sua resposta foi registrada com sucesso! 💗`;

        notice.classList.add("show");
        form.reset();

    } catch (erro) {

        console.error("Erro ao salvar no Supabase:", erro);
        notice.textContent =
            "Não foi possível enviar. Tente novamente.";

        notice.classList.add("show");

    } finally {

        button.disabled = false;
        button.textContent = "Confirmar presença ✨";

    }

});