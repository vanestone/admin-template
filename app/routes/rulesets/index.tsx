import PageLoading from '@app/components/page-loading';
import React, { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const RulesetsLazy = lazy(() => import('@app/pages/rulesets'));
const RuleGroupLazy = lazy(() => import('@app/pages/rulesets/rule-group'));

const Rulesets = (
  <React.Suspense fallback={<PageLoading />}>
    <RulesetsLazy />
  </React.Suspense>
);

const RuleGroup = (
  <React.Suspense fallback={<PageLoading />}>
    <RuleGroupLazy />
  </React.Suspense>
);

const ruleset: RouteObject[] = [
  {
    path: '/rulesets',
    element: Rulesets,
  },
  {
    path: '/rulesets/:rulesetId',
    element: RuleGroup,
  },
];

export default ruleset;
