import { EXTERNALMOVES } from '../libs/constants';
import { minValueFromNumberArray, maxValueFromNumberArray} from './general-utils';


export async function processConversions(data) {
  let conversions = {};

  // Create an intermediary wrapper without the gameData
  let conversionsList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (conversionsList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (conversionsList[character][stage]) {
            conversionsList[character][stage] = [
              ...conversionsList[character][stage],
              ...data[game][character][stage]
            ];
          } else {
            conversionsList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        conversionsList[character] = data[game][character];
      }
    }
  }

  for (const opponentChar of Object.keys(conversionsList)) {
    let neutralAllStages = [];
    let punishesAllStages = [];
    let oneHitOnlyNeutralAllStages = [];
    let oneHitOnlyPunishesAllStages = [];
    let neutralFirstHitsAllStages = [];
    let neutralKillLastHitsAllStages = [];
    let neutralKillFirstHitsAllStages = [];
    let punishFirstHitsAllStages = [];
    let punishKillFirstHitsAllStages = [];
    let punishKillLastHitsAllStages = [];

    for (const stage of Object.keys(conversionsList[opponentChar])) {
      let neutral = [];
      let punishes = [];
      let oneHitOnlyNeutral = [];
      let oneHitOnlyPunishes = [];
      let neutralFirstHits = [];
      let neutralKillLastHits = [];
      let neutralKillFirstHits = [];
      let punishFirstHits = [];
      let punishKillFirstHits = [];
      let punishKillLastHits = [];
      for (const conversion of conversionsList[opponentChar][stage]) {
        if (conversion.openingType === 'neutral-win') {
          // Neutral Win
          if (conversion.moves.length > 1) {
            neutral.push({
              totalDamage: conversion.currentPercent - conversion.startPercent,
              moves: conversion.moves,
            });
          } else {
            oneHitOnlyNeutral.push({
              totalDamage: conversion.currentPercent - conversion.startPercent,
              moves: conversion.moves,
            })
          }
          if (conversion.didKill) {
            neutralKillFirstHits.push({
              moveId: conversion.moves[0]?.moveId ? conversion.moves[0]?.moveId : undefined
            });
            if (conversion?.moves?.length > 0) {
              neutralKillLastHits.push({
                moveId: conversion.moves[conversion.moves.length - 1]?.moveId ? conversion.moves[conversion.moves.length - 1].moveId : undefined
              });
            }
          }
          neutralFirstHits.push({
            moveId: conversion.moves[0]?.moveId ? conversion.moves[0]?.moveId : undefined
          });
        } else if (conversion.openingType === 'counter-attack') {
          // Punish
          if (conversion.moves.length > 1) {
            punishes.push({
              totalDamage: conversion.currentPercent - conversion.startPercent,
              moves: conversion.moves,
            });
          } else {
            oneHitOnlyPunishes.push({
              totalDamage: conversion.currentPercent - conversion.startPercent,
              moves: conversion.moves,
            });
          }
          if (conversion.didKill) {
            punishKillFirstHits.push({
              moveId: conversion.moves[0]?.moveId ? conversion.moves[0]?.moveId : undefined
            });
            if (conversion?.moves?.length > 0) {
              punishKillLastHits.push({
                moveId: conversion.moves[conversion.moves.length - 1]?.moveId ? conversion.moves[conversion.moves.length - 1].moveId : undefined
              });
            }
          }
          punishFirstHits.push({
            moveId: conversion.moves[0]?.moveId ? conversion.moves[0]?.moveId : undefined
          });
        }
      }

      if (!conversions[opponentChar]) {
        conversions[opponentChar] = {};
      }
      conversions[opponentChar][stage] = {};
      conversions[opponentChar][stage].processedNeutralWinsConversions = {};
      conversions[opponentChar][stage].processedPunishes = {};
      conversions[opponentChar][stage].processedNeutralWinsConversions['multi-hits'] = calculMoyenneConversion(neutral);
      conversions[opponentChar][stage].processedNeutralWinsConversions['single-hit'] = calculMoyenneConversion(oneHitOnlyNeutral, true);
      conversions[opponentChar][stage].processedPunishes['multi-hits'] = calculMoyenneConversion(punishes);
      conversions[opponentChar][stage].processedPunishes['single-hit'] = calculMoyenneConversion(oneHitOnlyPunishes, true);
      conversions[opponentChar][stage].processedNeutralWinsFirstHits = calculMostCommonMove(neutralFirstHits);
      conversions[opponentChar][stage].processedKillNeutralFirstHits = calculMostCommonMove(neutralKillFirstHits);
      conversions[opponentChar][stage].processedKillNeutralLastHits = calculMostCommonMove(neutralKillLastHits);
      conversions[opponentChar][stage].processedPunishesFirstHits = calculMostCommonMove(punishFirstHits);
      conversions[opponentChar][stage].processedKillPunishFirstHits = calculMostCommonMove(punishKillFirstHits);
      conversions[opponentChar][stage].processedKillPunishLastHits = calculMostCommonMove(punishKillLastHits);
      conversions[opponentChar][stage].processedDamageForMostCommonNeutralOpeners = averageDamageForMostCommonStarters(3, [...neutral, ...oneHitOnlyNeutral], neutralFirstHits.map(move => move.moveId));
      conversions[opponentChar][stage].processedDamageForMostCommonPunishStarts = averageDamageForMostCommonStarters(3, [...punishes, ...oneHitOnlyPunishes], punishFirstHits.map(move => move.moveId));

      //AllStages
      neutralAllStages.push(...neutral);
      oneHitOnlyNeutralAllStages.push(...oneHitOnlyNeutral);
      neutralKillFirstHitsAllStages.push(...neutralKillFirstHits);
      neutralKillLastHitsAllStages.push(...neutralKillLastHits);
      neutralFirstHitsAllStages.push(...neutralFirstHits);
      punishesAllStages.push(...punishes);
      oneHitOnlyPunishesAllStages.push(...oneHitOnlyPunishes);
      punishKillFirstHitsAllStages.push(...punishKillFirstHits);
      punishKillLastHitsAllStages.push(...punishFirstHits);
      punishFirstHitsAllStages.push(...punishFirstHits);
    }

    if (!conversions[opponentChar]['allStages']) {
      conversions[opponentChar]['allStages'] = {};
    }
    conversions[opponentChar]['allStages'].processedNeutralWinsConversions = {};
    conversions[opponentChar]['allStages'].processedPunishes = {};
    conversions[opponentChar]['allStages'].processedNeutralWinsConversions['multi-hits'] = calculMoyenneConversion(neutralAllStages);
    conversions[opponentChar]['allStages'].processedNeutralWinsConversions['single-hit'] = calculMoyenneConversion(oneHitOnlyNeutralAllStages, true);
    conversions[opponentChar]['allStages'].processedPunishes['multi-hits'] = calculMoyenneConversion(punishesAllStages);
    conversions[opponentChar]['allStages'].processedPunishes['single-hit'] = calculMoyenneConversion(oneHitOnlyPunishesAllStages, true);
    conversions[opponentChar]['allStages'].processedNeutralWinsFirstHits = calculMostCommonMove(neutralFirstHitsAllStages);
    conversions[opponentChar]['allStages'].processedKillNeutralFirstHits = calculMostCommonMove(neutralKillFirstHitsAllStages);
    conversions[opponentChar]['allStages'].processedKillNeutralLastHits = calculMostCommonMove(neutralKillLastHitsAllStages);
    conversions[opponentChar]['allStages'].processedPunishesFirstHits = calculMostCommonMove(punishFirstHitsAllStages);
    conversions[opponentChar]['allStages'].processedKillPunishFirstHits = calculMostCommonMove(punishKillFirstHitsAllStages);
    conversions[opponentChar]['allStages'].processedKillPunishLastHits = calculMostCommonMove(punishKillLastHitsAllStages);
    conversions[opponentChar]['allStages'].processedDamageForMostCommonNeutralOpeners = averageDamageForMostCommonStarters(3, [...neutralAllStages, ...oneHitOnlyNeutralAllStages], neutralFirstHitsAllStages.map(move => move.moveId));
    conversions[opponentChar]['allStages'].processedDamageForMostCommonPunishStarts = averageDamageForMostCommonStarters(3, [...punishesAllStages, ...oneHitOnlyPunishesAllStages], punishFirstHitsAllStages.map(move => move.moveId));
  }
  return conversions;
}

export async function processOverallList(data) {
  let processedOverallList = {};
  // Create an intermediary wrapper without the gameData
  let overallList = {};
  for (let game of Object.keys(data)) {
    for (let character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (overallList[character]) {
        for (let stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (overallList[character][stage]) {
            overallList[character][stage] = [
              ...overallList[character][stage],
              data[game][character][stage]
            ];
          } else {
            overallList[character][stage] = [data[game][character][stage]];
          }
        }
      } else {
        overallList[character] = {};
        for (let stage of Object.keys(data[game][character])) {
          overallList[character][stage] = [data[game][character][stage]];
        }
      }
    }
  }

  let overallDatas;
  let overallDatasAllStages;
  for (const opponentChar of Object.keys(overallList)) {
    processedOverallList[opponentChar] = {};
    overallDatasAllStages = {
      totalDamages: [],
      conversionsRatio: [],
      killCounts: [],
      openingsPerKills: [],
    }
    for (const stage of Object.keys(overallList[opponentChar])) {
      overallDatas = {
        totalDamages: [],
        conversionsRatio: [],
        killCounts: [],
        openingsPerKills: [],
      }
      for (const overall of overallList[opponentChar][stage]) {
        overallDatas.totalDamages.push(overall.totalDamage);
        overallDatas.killCounts.push(overall.killCount);
        overallDatas.conversionsRatio.push(overall.conversionsRatio);
        overallDatas.openingsPerKills.push(overall.openingsPerKill?.ratio ? overall.openingsPerKill?.ratio : undefined);

        //All stages
        overallDatasAllStages.totalDamages.push(overall.totalDamage);
        overallDatasAllStages.killCounts.push(overall.killCount);
        overallDatasAllStages.conversionsRatio.push(overall.conversionsRatio);
        overallDatasAllStages.openingsPerKills.push(overall.openingsPerKill?.ratio ? overall.openingsPerKill?.ratio : undefined);
      }

      processedOverallList[opponentChar][stage] = {
        totalDamageMoyenne: calculMoyenneOverall(overallDatas.totalDamages),
        killCountMoyenne: calculMoyenneOverall(overallDatas.killCounts),
        conversionsRatio: calculMoyenneOverall(overallDatas.conversionsRatio),
        openingsPerKillMoyenne: calculMoyenneOverall(overallDatas.openingsPerKills),
        killPercentMoyenne: calculMoyenneOverall(overallDatas.totalDamages) / calculMoyenneOverall(overallDatas.killCounts),
      }
    }
    // All stages
    processedOverallList[opponentChar]['allStages'] = {
      totalDamageMoyenne: calculMoyenneOverall(overallDatasAllStages.totalDamages),
      killCountMoyenne: calculMoyenneOverall(overallDatasAllStages.killCounts),
      conversionsRatio: calculMoyenneOverall(overallDatasAllStages.conversionsRatio),
      openingsPerKillMoyenne: calculMoyenneOverall(overallDatasAllStages.openingsPerKills),
      killPercentMoyenne: calculMoyenneOverall(overallDatasAllStages.totalDamages) / calculMoyenneOverall(overallDatasAllStages.killCounts),
    }
  }
  return processedOverallList;
}

export async function processPunishedActions(data) {
  let processedPunishedActionsList = {};
  let punishedActions;
  let punishedActionsAllStages;

  // Create an intermediary wrapper without the gameData
  let punishedActionsList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (punishedActionsList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (punishedActionsList[character][stage]) {
            punishedActionsList[character][stage] = {
              punishedAttacks: [
                ...punishedActionsList[character][stage].punishedAttacks,
                ...data[game][character][stage].punishedAttacks
              ],
              punishedDefensiveOptions: [
                ...punishedActionsList[character][stage].punishedDefensiveOptions,
                ...data[game][character][stage].punishedDefensiveOptions
              ],
              punishedMovementOptions: [
                ...punishedActionsList[character][stage].punishedMovementOptions,
                ...data[game][character][stage].punishedMovementOptions
              ],
            };
          } else {
            punishedActionsList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        // First game with this character
        punishedActionsList[character] = data[game][character];
      }
    }
  }

  for (let character of Object.keys(punishedActionsList)) {
    processedPunishedActionsList[character] = {};
    punishedActionsAllStages = {
      punishedAttacks: [],
      punishedDefensiveOptions: [],
      punishedMovementOptions: []
    }
    for (let stage of Object.keys(punishedActionsList[character])) {
      punishedActions = {
        punishedAttacks: [],
        punishedDefensiveOptions: [],
        punishedMovementOptions: []
      }

      punishedActions.punishedAttacks = punishedActionsList[character][stage].punishedAttacks;
      punishedActions.punishedDefensiveOptions = punishedActionsList[character][stage].punishedDefensiveOptions;
      punishedActions.punishedMovementOptions = punishedActionsList[character][stage].punishedMovementOptions;

      punishedActionsAllStages.punishedAttacks.push(...punishedActionsList[character][stage].punishedAttacks);
      punishedActionsAllStages.punishedDefensiveOptions.push(...punishedActionsList[character][stage].punishedDefensiveOptions);
      punishedActionsAllStages.punishedMovementOptions.push(...punishedActionsList[character][stage].punishedMovementOptions);

      // Process Data for current stage
      processedPunishedActionsList[character][stage] = {
        punishedAttacks: {
          onHit: countOptions(
            punishedActions.punishedAttacks
              .filter(punishedAttack => punishedAttack.status === 'Hit')
              .map(punishedAttack => punishedAttack.name)
          ).map(
            (countOption) => {
              return {
                attack: countOption.option,
                count: countOption.count
              }
            }
          ),
          onShield: countOptions(
            punishedActions.punishedAttacks
              .filter(punishedAttack => punishedAttack.status === 'Shield')
              .map(punishedAttack => punishedAttack.name)
          ).map(
            (countOption) => {
              return {
                attack: countOption.option,
                count: countOption.count
              }
            }
          ),
          onWhiff: countOptions(
            punishedActions.punishedAttacks
              .filter(punishedAttack => punishedAttack.status === 'Whiff')
              .map(punishedAttack => punishedAttack.name)
          ).map(
            (countOption) => {
              return {
                attack: countOption.option,
                count: countOption.count
              }
            }
          ),
        },
        punishedDefensiveOptions: countOptions(punishedActions.punishedDefensiveOptions).map(
          (countOption) => {
            return {
              defensiveOption: countOption.option,
              count: countOption.count
            }
          }
        ),
        punishedMovementOptions: countOptions(punishedActions.punishedMovementOptions).map(
          (countOption) => {
            return {
              movementOption: countOption.option,
              count: countOption.count
            }
          }
        )
      };
    }
    // Process Data for all stages
    processedPunishedActionsList[character]['allStages'] = {
      punishedAttacks: {
        onHit: countOptions(
          punishedActionsAllStages.punishedAttacks
            .filter(punishedAttack => punishedAttack.status === 'Hit')
            .map(punishedAttack => punishedAttack.name)
        ).map(
          (countOption) => {
            return {
              attack: countOption.option,
              count: countOption.count
            }
          }
        ),
        onShield: countOptions(
          punishedActionsAllStages.punishedAttacks
            .filter(punishedAttack => punishedAttack.status === 'Shield')
            .map(punishedAttack => punishedAttack.name)
        ).map(
          (countOption) => {
            return {
              attack: countOption.option,
              count: countOption.count
            }
          }
        ),
        onPShield: countOptions(
          punishedActionsAllStages.punishedAttacks
            .filter(punishedAttack => punishedAttack.status === 'Powershield')
            .map(punishedAttack => punishedAttack.name)
        ).map(
          (countOption) => {
            return {
              attack: countOption.option,
              count: countOption.count
            }
          }
        ),
        onWhiff: countOptions(
          punishedActionsAllStages.punishedAttacks
            .filter(punishedAttack => punishedAttack.status === 'Whiff')
            .map(punishedAttack => punishedAttack.name)
        ).map(
          (countOption) => {
            return {
              attack: countOption.option,
              count: countOption.count
            }
          }
        ),
      },
      punishedDefensiveOptions: countOptions(punishedActionsAllStages.punishedDefensiveOptions).map(
        (countOption) => {
          return {
            defensiveOption: countOption.option,
            count: countOption.count
          }
        }
      ),
      punishedMovementOptions: countOptions(punishedActionsAllStages.punishedMovementOptions).map(
        (countOption) => {
          return {
            movementOption: countOption.option,
            count: countOption.count
          }
        }
      )

    };
  }
  return processedPunishedActionsList;
}

export async function processLCancels(data) {
  let processedLCancels = {};
  let lcancels;
  let lcancelsAllStages;

  // Create an intermediary wrapper without the gameData
  let lcancelsList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (lcancelsList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (lcancelsList[character][stage]) {
            lcancelsList[character][stage] = {
              failedMoves: [
                ...lcancelsList[character][stage].failedMoves,
                ...data[game][character][stage].failedMoves
              ],
              lcancels: {
                successful: lcancelsList[character][stage].lcancels.successful + data[game][character][stage].lcancels.successful,
                failed: lcancelsList[character][stage].lcancels.failed + data[game][character][stage].lcancels.failed,
              }
            };
          } else {
            lcancelsList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        // First game with this character
        lcancelsList[character] = data[game][character];
      }
    }
  }
  for (let character of Object.keys(lcancelsList)) {
    processedLCancels[character] = {};
    lcancelsAllStages = {
      lcancels: [],
      failedMoves: []
    };
    for (let stage of Object.keys(lcancelsList[character])) {
      lcancels = lcancelsList[character][stage];
      lcancelsAllStages.lcancels.push(lcancelsList[character][stage].lcancels)
      lcancelsAllStages.failedMoves.push(...lcancelsList[character][stage].failedMoves)

      // Process data for current stage
      processedLCancels[character][stage] = {
        lcancels: lcancels.lcancels,
        failedMoves: countOptions(lcancels.failedMoves).map(
          (countOption) => {
            return {
              move: countOption.option,
              count: countOption.count,
            }
          }
        )
      };
    }
    // Process data for all stages
    processedLCancels[character]['allStages'] = {
      lcancels: sumLcancels(lcancelsAllStages.lcancels),
      failedMoves: countOptions(lcancelsAllStages.failedMoves).map(
        (countOption) => {
          return {
            move: countOption.option,
            count: countOption.count,
          }
        }
      )
    };
  }
  return processedLCancels;
}

export async function processWinrates(data) {
  let processedWinRates = {};
  let winrate;
  let winrateAllStages;

  // Create an intermediary wrapper without the gameData
  let gameResultsList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (!gameResultsList[character]) {
        // First game with this character
        gameResultsList[character] = {};
      }
      for (const stage of Object.keys(data[game][character])) {
        // Same here, we'll only have one stage each time here
        if (gameResultsList[character][stage]) {
          gameResultsList[character][stage] = [
            ...gameResultsList[character][stage],
            data[game][character][stage]
          ];

        } else {
          gameResultsList[character][stage] = [data[game][character][stage]];
        }
      }
    }
  }

  for (let character of Object.keys(gameResultsList)) {
    processedWinRates[character] = {};
    winrateAllStages = [];
    for (let stage of Object.keys(gameResultsList[character])) {
      winrate = gameResultsList[character][stage];
      winrateAllStages.push(...gameResultsList[character][stage]);

      // Process data for current stage
      let wins = 0;
      let losses = 0;
      for (let result of winrate) {
        if (result === 'win') wins++;
        if (result === 'loss') losses++;
      }
      processedWinRates[character][stage] = wins * 100 / (wins + losses);
    }
    // Process data for all stages
    let wins = 0;
    let losses = 0;
    for (let result of winrateAllStages) {
      if (result === 'win') wins++;
      if (result === 'loss') losses++;
    }
    processedWinRates[character]['allStages'] = wins * 100 / (wins + losses);
  }
  return processedWinRates;
}

export async function processLedgeDashes(data) {
  let processedLedgeDashes = {};
  let ledgeDashes;
  let ledgeDashesAllStages;

  // Create an intermediary wrapper without the gameData
  let ledgeDashesList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (ledgeDashesList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (ledgeDashesList[character][stage]) {
            if (data[game][character][stage]) {
              if (data[game][character][stage]['invincible']) {
                if (ledgeDashesList[character][stage]['invincible']) {
                  ledgeDashesList[character][stage]['invincible'].push(
                    ...data[game][character][stage]['invincible']
                  );
                } else {
                  ledgeDashesList[character][stage]['invincible'] = [...data[game][character][stage]['invincible']];
                }
              }

              if (data[game][character][stage]['notInvincible']) {
                if (ledgeDashesList[character][stage]['notInvincible']) {
                  ledgeDashesList[character][stage]['notInvincible'].push(
                    ...data[game][character][stage]['notInvincible']
                  );
                } else {
                  ledgeDashesList[character][stage]['notInvincible'] = [...data[game][character][stage]['notInvincible']];
                }
              }
            }
          } else {
            ledgeDashesList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        // First game with this character
        ledgeDashesList[character] = data[game][character];
      }
    }
  }

  for (let character of Object.keys(ledgeDashesList)) {
    processedLedgeDashes[character] = {};
    ledgeDashesAllStages = {
      invincible: [],
      notInvincible: [],
    }
    for (let stage of Object.keys(ledgeDashesList[character])) {
      ledgeDashes = ledgeDashesList[character][stage];
      if (ledgeDashesList[character] && ledgeDashesList[character][stage]) {
        if (ledgeDashesList[character][stage]['invincible']?.length > 0) {
          ledgeDashesAllStages.invincible.push(...ledgeDashesList[character][stage]['invincible']);
        }
        if (ledgeDashesList[character][stage]['notInvincible']?.length > 0) {
          ledgeDashesAllStages.notInvincible.push(...ledgeDashesList[character][stage]['notInvincible']);
        }
      }
      let invincible;
      let notInvincible;
      // Process data for current stage
      if (ledgeDashes && ledgeDashes['invincible']) {
        const averageFramesSinceLedgeDropInvincible = calculMoyenneOverall(ledgeDashes['invincible'].map(
          ledgeDash => ledgeDash.framesSinceLedgeDrop
        ));
        const averageExtraInvincibilityFrames = calculMoyenneOverall(ledgeDashes['invincible'].map(
          ledgeDash => ledgeDash.extraInvincibilityFrames
        ));
        const minFramesSinceLedgedropInvincible = minValueFromNumberArray(ledgeDashes['invincible'].map(
          ledgeDash => ledgeDash.framesSinceLedgeDrop
        ));
        const maxExtraInvincibilityFrames = maxValueFromNumberArray(ledgeDashes['invincible'].map(
          ledgeDash => ledgeDash.extraInvincibilityFrames
        ));
        let percentOfTotalLedgedashes;
        if (ledgeDashes['notInvincible']) {
          if (ledgeDashes['invincible']?.length > 0) {
            percentOfTotalLedgedashes = ledgeDashes['invincible'].length * 100 / (ledgeDashes['invincible'].length + ledgeDashes['notInvincible'].length);
          } else {
            percentOfTotalLedgedashes = 0;
          }
        } else {
          percentOfTotalLedgedashes = 100;
        }

        invincible = {
          percentOfTotalLedgedashes,
          averageFramesSinceLedgeDrop: averageFramesSinceLedgeDropInvincible,
          averageExtraInvincibilityFrames,
          minFramesSinceLedgeDrop: minFramesSinceLedgedropInvincible,
          maxExtraInvincibilityFrames
        }

      }
      if (ledgeDashes && ledgeDashes['notInvincible']) {
        const averageFramesSinceLedgeDropNotInvincible = calculMoyenneOverall(ledgeDashes['notInvincible'].map(
          ledgeDash => ledgeDash.framesSinceLedgeDrop
        ));
        const minFramesSinceLedgedropNotInvincible = minValueFromNumberArray(ledgeDashes['notInvincible'].map(
          ledgeDash => ledgeDash.framesSinceLedgeDrop
        ));
        const maxFramesSinceLedgedropNotInvincible = maxValueFromNumberArray(ledgeDashes['notInvincible'].map(
          ledgeDash => ledgeDash.framesSinceLedgeDrop
        ));
        const averageVulnerabilityFrames = calculMoyenneOverall(ledgeDashes['notInvincible'].map(ledgeDash => ledgeDash.vulnerableFrames));
        const minVulnerabilityFrames = minValueFromNumberArray(ledgeDashes['notInvincible'].map(
          ledgeDash => ledgeDash.vulnerableFrames
        ));
        const maxVulnerabilityFrames = maxValueFromNumberArray(ledgeDashes['notInvincible'].map(
          ledgeDash => ledgeDash.vulnerableFrames
        ));
        notInvincible = {
          averageFramesSinceLedgeDrop: averageFramesSinceLedgeDropNotInvincible,
          minFramesSinceLedgeDrop: minFramesSinceLedgedropNotInvincible,
          maxFramesSinceLedgeDrop: maxFramesSinceLedgedropNotInvincible,
          averageVulnerabilityFrames,
          minVulnerabilityFrames,
          maxVulnerabilityFrames
        }
      }

      processedLedgeDashes[character][stage] = {
        invincible,
        notInvincible,
      }
    }
    // Process data for all stages
    let invincible;
    let notInvincible;
    if (ledgeDashesAllStages && ledgeDashesAllStages['invincible']) {
      const averageFramesSinceLedgeDropInvincible = calculMoyenneOverall(ledgeDashesAllStages['invincible'].map(
        ledgeDash => ledgeDash.framesSinceLedgeDrop
      ));
      const averageExtraInvincibilityFrames = calculMoyenneOverall(ledgeDashesAllStages['invincible'].map(
        ledgeDash => ledgeDash.extraInvincibilityFrames
      ));
      const minFramesSinceLedgedropInvincible = minValueFromNumberArray(ledgeDashesAllStages['invincible'].map(
        ledgeDash => ledgeDash.framesSinceLedgeDrop
      ));
      const maxExtraInvincibilityFrames = maxValueFromNumberArray(ledgeDashesAllStages['invincible'].map(
        ledgeDash => ledgeDash.extraInvincibilityFrames
      ));

      let percentOfTotalLedgedashes;
      if (ledgeDashesAllStages['notInvincible']) {
        if (ledgeDashesAllStages['invincible']?.length > 0) {
          percentOfTotalLedgedashes = ledgeDashesAllStages['invincible'].length * 100 / (ledgeDashesAllStages['invincible'].length + ledgeDashesAllStages['notInvincible'].length);
        } else {
          percentOfTotalLedgedashes = 0;
        }
      } else {
        percentOfTotalLedgedashes = 100;
      }

      invincible = {
        percentOfTotalLedgedashes,
        averageFramesSinceLedgeDrop: averageFramesSinceLedgeDropInvincible,
        averageExtraInvincibilityFrames,
        minFramesSinceLedgeDrop: minFramesSinceLedgedropInvincible,
        maxExtraInvincibilityFrames
      }
    }

    if (ledgeDashesAllStages && ledgeDashesAllStages['notInvincible']) {
      const averageFramesSinceLedgeDropNotInvincible = calculMoyenneOverall(ledgeDashesAllStages['notInvincible'].map(
        ledgeDash => ledgeDash.framesSinceLedgeDrop
      ));
      const minFramesSinceLedgedropNotInvincible = minValueFromNumberArray(ledgeDashesAllStages['notInvincible'].map(
        ledgeDash => ledgeDash.framesSinceLedgeDrop
      ));
      const maxFramesSinceLedgedropNotInvincible = maxValueFromNumberArray(ledgeDashesAllStages['notInvincible'].map(
        ledgeDash => ledgeDash.framesSinceLedgeDrop
      ));
      const averageVulnerabilityFrames = calculMoyenneOverall(ledgeDashesAllStages['notInvincible'].map(ledgeDash => ledgeDash.vulnerableFrames));
      const minVulnerabilityFrames = minValueFromNumberArray(ledgeDashesAllStages['notInvincible'].map(
        ledgeDash => ledgeDash.vulnerableFrames
      ));
      const maxVulnerabilityFrames = maxValueFromNumberArray(ledgeDashesAllStages['notInvincible'].map(
        ledgeDash => ledgeDash.vulnerableFrames
      ));

      notInvincible = {
        averageFramesSinceLedgeDrop: averageFramesSinceLedgeDropNotInvincible,
        minFramesSinceLedgeDrop: minFramesSinceLedgedropNotInvincible,
        maxFramesSinceLedgeDrop: maxFramesSinceLedgedropNotInvincible,
        averageVulnerabilityFrames,
        minVulnerabilityFrames,
        maxVulnerabilityFrames
      }
    }

    processedLedgeDashes[character]['allStages'] = {
      invincible,
      notInvincible
    }
  }
  return processedLedgeDashes;
}

export async function processWavedashes(data) {
  let processedWavedashes = {};
  let wavedashes;
  let wavedashesAllStages;

  // Create an intermediary wrapper without the gameData
  let wavedashesList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (wavedashesList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (wavedashesList[character][stage]) {
            wavedashesList[character][stage] = {
              frame1: wavedashesList[character][stage].frame1 + data[game][character][stage].frame1,
              frame2: wavedashesList[character][stage].frame2 + data[game][character][stage].frame2,
              frame3: wavedashesList[character][stage].frame3 + data[game][character][stage].frame3,
              more: wavedashesList[character][stage].more + data[game][character][stage].more,
              total: wavedashesList[character][stage].total + data[game][character][stage].total,
            };
          } else {
            wavedashesList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        // First game with this character
        wavedashesList[character] = data[game][character];
      }
    }
  }

  for (let character of Object.keys(wavedashesList)) {
    processedWavedashes[character] = {};
    wavedashesAllStages = {
      frame1: 0,
      frame2: 0,
      frame3: 0,
      more: 0,
      total: 0,
    };
    for (let stage of Object.keys(wavedashesList[character])) {
      wavedashes = wavedashesList[character][stage];
      wavedashesAllStages.frame1 += wavedashes.frame1;
      wavedashesAllStages.frame2 += wavedashes.frame2;
      wavedashesAllStages.frame3 += wavedashes.frame3;
      wavedashesAllStages.more += wavedashes.more;
      wavedashesAllStages.total += wavedashes.total;

      // Process data for current stage
      if (wavedashes.total !== 0) {
        processedWavedashes[character][stage] = {
          frame1: wavedashes.frame1 / wavedashes.total * 100,
          frame2: wavedashes.frame2 / wavedashes.total * 100,
          frame3: wavedashes.frame3 / wavedashes.total * 100,
          more: wavedashes.more / wavedashes.total * 100,
          total: wavedashes.total
        }
      } else {
        processedWavedashes[character][stage] = {
          frame1: 0,
          frame2: 0,
          frame3: 0,
          more: 0,
          total: 0
        }
      }
    }
    // Process data for all stages
    if (wavedashesAllStages.total !== 0) {
      processedWavedashes[character]['allStages'] = {
        frame1: wavedashesAllStages.frame1 / wavedashesAllStages.total * 100,
        frame2: wavedashesAllStages.frame2 / wavedashesAllStages.total * 100,
        frame3: wavedashesAllStages.frame3 / wavedashesAllStages.total * 100,
        more: wavedashesAllStages.more / wavedashesAllStages.total * 100,
        total: wavedashesAllStages.total
      }
    } else {
      processedWavedashes[character]['allStages'] = {
        frame1: 0,
        frame2: 0,
        frame3: 0,
        more: 0,
        total: 0
      }
    }
  }

  return processedWavedashes;
}

export async function processJCGrabs(data) {
  let processedJCGrabs = {};
  let jcGrabs;
  let jcGrabsAllStages;

  // Create an intermediary wrapper without the gameData
  let jcGrabsList = {};
  for (const game of Object.keys(data)) {
    for (const character of Object.keys(data[game])) {
      // We'll only have one character each time here (opponent's character)
      if (jcGrabsList[character]) {
        for (const stage of Object.keys(data[game][character])) {
          // Same here, we'll only have one stage each time here
          if (jcGrabsList[character][stage]) {
            jcGrabsList[character][stage] = {
              successful: {
                frame1: jcGrabsList[character][stage].successful.frame1 + data[game][character][stage].successful.frame1,
                frame2: jcGrabsList[character][stage].successful.frame2 + data[game][character][stage].successful.frame2,
                frame3orMore: jcGrabsList[character][stage].successful.frame3orMore + data[game][character][stage].successful.frame3orMore,
              },
              failed: {
                oneFrameLate: jcGrabsList[character][stage].failed.oneFrameLate + data[game][character][stage].failed.oneFrameLate,
                twoFramesLate: jcGrabsList[character][stage].failed.twoFramesLate + data[game][character][stage].failed.twoFramesLate,
                threeFramesLate: jcGrabsList[character][stage].failed.threeFramesLate + data[game][character][stage].failed.threeFramesLate,
              },
              total: jcGrabsList[character][stage].total + data[game][character][stage].total
            }
          } else {
            jcGrabsList[character][stage] = data[game][character][stage];
          }
        }
      } else {
        // First game with this character
        jcGrabsList[character] = data[game][character];
      }
    }
  }

  for (let character of Object.keys(jcGrabsList)) {
    processedJCGrabs[character] = {};
    jcGrabsAllStages = {
      successful: {
        frame1: 0,
        frame2: 0,
        frame3orMore: 0
      },
      failed: {
        oneFrameLate: 0,
        twoFramesLate: 0,
        threeFramesLate: 0
      },
      total: 0
    };
    for (let stage of Object.keys(jcGrabsList[character])) {
      jcGrabs = jcGrabsList[character][stage];
      jcGrabsAllStages.successful.frame1 += jcGrabs.successful.frame1;
      jcGrabsAllStages.successful.frame2 += jcGrabs.successful.frame2;
      jcGrabsAllStages.successful.frame3orMore += jcGrabs.successful.frame3orMore;
      jcGrabsAllStages.failed.oneFrameLate += jcGrabs.failed.oneFrameLate;
      jcGrabsAllStages.failed.twoFramesLate += jcGrabs.failed.twoFramesLate;
      jcGrabsAllStages.failed.threeFramesLate += jcGrabs.failed.threeFramesLate;
      jcGrabsAllStages.total += jcGrabs.total;

      // Process data for current stage
      if (jcGrabs.total !== 0) {
        processedJCGrabs[character][stage] = {
          successful: {
            frame1: jcGrabs.successful.frame1 / jcGrabs.total * 100,
            frame2: jcGrabs.successful.frame2 / jcGrabs.total * 100,
            frame3orMore: jcGrabs.successful.frame3orMore / jcGrabs.total * 100,
          },
          failed: {
            oneFrameLate: jcGrabs.failed.oneFrameLate / jcGrabs.total * 100,
            twoFramesLate: jcGrabs.failed.twoFramesLate / jcGrabs.total * 100,
            threeFramesLate: jcGrabs.failed.threeFramesLate / jcGrabs.total * 100,
          }
        };
      } else {
        processedJCGrabs[character][stage] = {
          successful: {
            frame1: 0,
            frame2: 0,
            frame3orMore: 0,
          },
          failed: {
            oneFrameLate: 0,
            twoFramesLate: 0,
            threeFramesLate: 0,
          }
        }
      }
    }
    // Process data for current stage
    if (jcGrabsAllStages.total !== 0) {
      processedJCGrabs[character]['allStages'] = {
        successful: {
          frame1: jcGrabsAllStages.successful.frame1 / jcGrabsAllStages.total * 100,
          frame2: jcGrabsAllStages.successful.frame2 / jcGrabsAllStages.total * 100,
          frame3orMore: jcGrabsAllStages.successful.frame3orMore / jcGrabsAllStages.total * 100,
        },
        failed: {
          oneFrameLate: jcGrabsAllStages.failed.oneFrameLate / jcGrabsAllStages.total * 100,
          twoFramesLate: jcGrabsAllStages.failed.twoFramesLate / jcGrabsAllStages.total * 100,
          threeFramesLate: jcGrabsAllStages.failed.threeFramesLate / jcGrabsAllStages.total * 100,
        }
      };
    } else {
      processedJCGrabs[character]['allStages'] = {
        successful: {
          frame1: 0,
          frame2: 0,
          frame3orMore: 0,
        },
        failed: {
          oneFrameLate: 0,
          twoFramesLate: 0,
          threeFramesLate: 0,
        }
      }
    }
  }

  return processedJCGrabs;
}

function averageDamageForMostCommonStarters(nbMoves, conversions, moveIds) {
  let most = [];
  for (let moveId of moveIds) {
    const index = most.findIndex(m => m.moveId === moveId);
    if (index !== -1) {
      most[index].count += 1;
    } else {
      most.push({ moveId, count: 1 });
    }
  }
  const mostUsedMoves = most.sort((m1, m2) => m2.count - m1.count);
  const result = [];
  for (let i = 0; i < mostUsedMoves.length && i < nbMoves; i++) {
    if (mostUsedMoves[i]) {
      let damage = 0;
      for (let conversion of conversions) {
        if (conversion.moves?.length > 0) { // Same as for slippi-stats-workerfile, apparently this can happen
          if (conversion.moves[0].moveId === mostUsedMoves[i].moveId) {
            damage += conversion.totalDamage;
          }
        } else {
          console.log('DEBUG : the weird conversion ', conversion);
        }
      }
      result.push({
        moveId: mostUsedMoves[i].moveId,
        averageDamage: damage / mostUsedMoves[i].count
      });
    }
  }
  return result;
}

function calculMoyenneOverall(array) {
  let val = 0;
  let ignoredValuesCount = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i]) {
      val += array[i];
    } else {
      ignoredValuesCount++;
    }
  }
  return (array.length - ignoredValuesCount !== 0) ? val / (array.length - ignoredValuesCount) : undefined;
}

function calculMoyenneConversion(conversions, oneHitMode = false) {
  let damage = 0;
  let moves = 0;
  let maxDamage = 0;
  let maxLength = 0;
  for (let i = 0; i < conversions.length; i++) {
    damage += conversions[i].totalDamage;
    if (maxDamage < conversions[i].totalDamage) {
      maxDamage = conversions[i].totalDamage;
    }
    if (!oneHitMode) {
      moves += conversions[i].moves.length;
      if (maxLength < conversions[i].moves.length) {
        maxLength = conversions[i].moves.length;
      }
    }
  }
  return {
    averageDamage: conversions.length !== 0 ? damage / conversions.length : undefined,
    averageLength: oneHitMode ? undefined : conversions.length !== 0 ? moves / conversions.length : undefined,
    maxDamage,
    maxLength,
  };
}

function calculMostCommonMove(movesArray) {
  let totalMovesCounted = 0;
  if (movesArray.length > 0) {
    let moves = {};
    for (const move of movesArray) {
      if (moves[move.moveId]) {
        moves[move.moveId] = moves[move.moveId] + 1
      } else {
        moves[move.moveId] = 1;
      }
      totalMovesCounted++;
    }
    let maxMoveId;
    for (const moveId of Object.keys(moves)) {
      if (maxMoveId) {
        if (moves[moveId] > moves[maxMoveId]) {
          maxMoveId = moveId;
        }
      } else {
        maxMoveId = moveId;
      }
    }
    const move = EXTERNALMOVES[maxMoveId];
    return { move: move ? move.name : 'Weird move', count: moves[maxMoveId] / totalMovesCounted * 100 };
  }
  return undefined;
}

function countOptions(options) {
  let returnValue = [];
  let totalOptionsCounted = 0;
  if (options?.length > 0) {
    for (let option of options) {
      const rvIndex = returnValue.findIndex(rv => rv.option === option);
      if (rvIndex !== -1) {
        returnValue[rvIndex].count++;
      } else {
        returnValue.push({ option: option, count: 1 });
      }
      totalOptionsCounted++;
    }
    for (let value of returnValue) {
      value.count = value.count / totalOptionsCounted * 100;
    }
  }
  return returnValue;
}

function sumLcancels(lcancels) {
  let returnValue = {
    successful: 0,
    failed: 0
  };
  for (let lcancel of lcancels) {
    returnValue.failed += lcancel.failed;
    returnValue.successful += lcancel.successful;
  }
  return returnValue;
}
