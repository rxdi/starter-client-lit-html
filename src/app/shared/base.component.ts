import { Injector } from '@rxdi/core';
import {
  ApolloClient,
  importQuery,
  MutationOptions,
  QueryOptions,
  SubscriptionOptions,
} from '@rxdi/graphql-client';
import { LitElement } from '@rxdi/lit-html';
import { DataProxy } from 'apollo-cache';
import { from, Observable } from 'rxjs';

import { IMutation, IQuery, ISubscription } from '../@introspection';
import { DocumentTypes } from '../@introspection/documentTypes';

type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ImportQueryMixin extends Without<QueryOptions, 'query'> {
  query: DocumentTypes;
}

interface ImportSubscriptionMixin
  extends Without<SubscriptionOptions, 'query'> {
  query: DocumentTypes;
}

interface ImportMutationMixin extends Without<MutationOptions, 'mutation'> {
  mutation: DocumentTypes;
  update?(proxy: DataProxy, res: { data: IMutation }): void;
}

export class BaseComponent extends LitElement {
  @Injector(ApolloClient) public graphql: ApolloClient;

  query<T = IQuery>(options: ImportQueryMixin) {
    options.query = importQuery(options.query);
    return from(this.graphql.query.bind(this.graphql)(options)) as Observable<{
      data: T;
    }>;
  }

  mutate<T = IMutation>(options: ImportMutationMixin) {
    options.mutation = importQuery(options.mutation);
    return from(this.graphql.mutate.bind(this.graphql)(options)) as Observable<{
      data: T;
    }>;
  }

  subscribe<T = ISubscription>(options: ImportSubscriptionMixin) {
    options.query = importQuery(options.query);
    return from(
      this.graphql.subscribe.bind(this.graphql)(options)
    ) as Observable<{ data: T }>;
  }
}
