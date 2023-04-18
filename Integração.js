const { default: axios, Axios } = require('axios');
const { error } = require('console');
const express = require('express');
const xml2js = require('xml2js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(`/ws/frete/:cep`, (req, res) => {
    const cep = req.params.cep;
    const url = `http://viacep.com.br/ws/${cep}/json/`

    axios.get(url)

        .then((response) => {

            const data = response.data
            res.send(data);
            console.log(data.uf);
        })
        .catch((error) => {

            console.error(error);
            res.status(500).send("Erro ao buscar endereço");
        });

});
app.get(`/ws/prazo/:CepOrigem/:CepDestino`, (req, res) => {
    const CepOrigem = req.params.CepOrigem;
    const CepDestino = req.params.CepDestino;
    cep = CepDestino;

    const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&nCdServico=41106&sCepOrigem=${CepOrigem}&sCepDestino=${CepDestino}&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=20&nVlLargura=20&nVlDiametro=0&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&StrRetorno=xml&nIndicaCalculo=3/`

    axios.get(url)

        .then((response) => {

            const xml = response.data;

            xml2js.parseString(xml, (err, result) => {

                if (err) {
                    console.error(err);
                    return res.status(500).send("Erro ao converter XML para JSON");
                };

                const data = result.Servicos.cServico[0];
                res.send(data)
            });

        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Erro ao Calcular o Prazo de Entrega e Valores");

        });

});
app.listen(3000, () => {

    console.log(`Rodando serviço na porta 3000`);
});