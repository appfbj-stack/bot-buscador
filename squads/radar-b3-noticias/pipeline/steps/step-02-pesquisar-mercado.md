---
execution: subagent
agent: pesquisador-b3
inputFile: squads/radar-b3-noticias/output/research-focus.md
outputFile: squads/radar-b3-noticias/output/mercado-coletado.md
model_tier: powerful
---

# Step 02: Pesquisar mercado

## Context Loading

Load estes arquivos:
- `squads/radar-b3-noticias/output/research-focus.md` — foco definido pelo usuário
- `squads/radar-b3-noticias/pipeline/data/research-brief.md` — guia de coleta
- `_opensquad/_memory/company.md` — contexto da empresa

## Instructions

### Process
1. Ler o foco solicitado e identificar ativos/índices alvo.
2. Coletar preços e variações recentes do mercado brasileiro para os ativos alvo.
3. Buscar notícias financeiras relevantes e recentes sobre esses ativos e setor.
4. Selecionar as notícias de maior impacto potencial.
5. Consolidar dados e notícias em um único documento estruturado.

## Output Format

O output deve seguir esta estrutura:
```markdown
# Mercado Coletado

## Escopo
- Recorte:
- Janela:
- Ativos:

## Mercado Geral
- Ibovespa:
- IFIX:

## Ativos Monitorados
| Ativo | Preço/Referência | Variação | Observação |
|---|---:|---:|---|

## Notícias Relevantes
1. Título:
   Fonte:
   Data:
   Resumo:
   Impacto potencial:

## Lacunas de Dados
- ...
```

## Output Example

Exemplo completo com dados reais do dia e no mínimo 3 notícias com fonte e data.

## Veto Conditions

Reject and redo if ANY are true:
1. Não traz fonte e data das notícias.
2. Não apresenta tabela de ativos monitorados.

## Quality Criteria

- [ ] Inclui escopo e janela temporal
- [ ] Inclui visão de mercado geral
- [ ] Inclui notícias com impacto potencial
