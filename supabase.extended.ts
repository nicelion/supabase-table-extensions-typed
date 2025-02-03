import { Database as PostgresSchema } from './supabase';

type PostgresTables = PostgresSchema['public']['Tables'];
type PostgresFunctions = PostgresSchema['public']['Functions'];


// THIS IS THE ONLY THING YOU EDIT
// <START>
type TableExtensions = { 
  /**
  my_existing_table_name: {
    my_json_column_override: {
      tel: string;
      name?: string;
      preset_id?: number;
    };
  };
  **/
};
// <END>
// ☝️ this is the only thing you edit

type FunctionsExtensions = {
  /**
	my_existing_function: {
		my_json_argument: {
			id: string;
			name: string;
			test: number[];
		};
	};
  */
};

type TakeDefinitionFromSecond<T extends object, P extends object> = Omit<
  T,
  keyof P
> &
  P;

type NewTables = {
  [k in keyof PostgresTables]: {
    Row: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<
          PostgresTables[k]['Row'],
          TableExtensions[k]
        >
      : PostgresTables[k]['Row'];
    Insert: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<
          PostgresTables[k]['Insert'],
          TableExtensions[k]
        >
      : PostgresTables[k]['Insert'];
    Update: k extends keyof TableExtensions
      ? Partial<
          TakeDefinitionFromSecond<
            PostgresTables[k]['Update'],
            TableExtensions[k]
          >
        >
      : PostgresTables[k]['Update'];
  };
};

type NewFunctions = {
	[k in keyof PostgresFunctions]: {
		Args: k extends keyof FunctionsExtensions
			? TakeDefinitionFromSecond<PostgresFunctions[k]['Args'], FunctionsExtensions[k]>
			: PostgresFunctions[k]['Args'];
		Returns: PostgresFunctions[k]['Returns'];
	};
};

export type Database = {
	public: Omit<PostgresSchema['public'], 'Tables' | 'Functions'> & {
		Tables: NewTables;
		Functions: NewFunctions;
	};
};

export type TableName = keyof Database['public']['Tables'];
export type TableRow<T extends TableName> =
  Database['public']['Tables'][T]['Row'];

export type FunctionName = keyof Database['public']['Functions'];
export type FunctionArgs<T extends FunctionName> =
Database['public']['Functions'][T]['Args'];

export type TableView<View extends keyof Database['public']['Views']> =
  Database['public']['Views'][View]['Row'];
