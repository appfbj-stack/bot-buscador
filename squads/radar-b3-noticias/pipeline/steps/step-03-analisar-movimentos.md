---
execution: inline
agent: analista-fluxo
inputFile: squads/radar-b3-noticias/output/mercado-coletado.md
outputFile: squads/radar-b3-noticias/output/analise-b3.md
---

# Step 03: Analisar movimentos

## Context Loading

Load estes arquivos:
- `squads/radar-b3-noticias/output/mercado-coletado.md` — coleta consolidada
- `squads/radar-b3-noticias/pipeline/data/domain-framework.md` — framework de análise
- `squads/radar-b3-noticias/pipeline/data/quality-criteria.md` — critérios de qualidade

## Instructions

### Process
1. Priorizar os principais movimentos do período.
2. Relacionar movimento com notícias e possíveis gatilhos.
3. Produzir resumo rápido em bullets.
4. Produzir relatório completo com leitura prática para decisão.

## Output Format

O output deve seguir esta estrutura:
```markdown
# Análise B3

## Resumo Rápido
- ...

## Relatório Completo
### 1) Visão Geral
### 2) Ativos em Destaque
### 3) Principais Transações e Notícias
### 4) Riscos de Curto Prazo
### 5) Próximos Gatilhos
```

## Output Example

Exemplo completo com resumo curto e relatório detalhado em cinco seções.

## Veto Conditions

Reject and redo if ANY are true:
1. Não inclui seção de riscos.
2. Não conecta movimento de preço com notícia.

## Quality Criteria

- [ ] Resumo rápido com até 6 bullets
- [ ] Relatório completo com 5 seções
- [ ] Riscos e gatilhos explícitos
