import pandas as pd
import os

agg_df = pd.read_csv(os.path.join('..', 'website', 'static', 'data', 'aggregate.csv'))

emigration_df = agg_df.groupby(['source', 'year']).sum().reset_index()
immigration_df = agg_df.groupby(['target', 'year']).sum().reset_index()

emigration_df.to_csv(os.path.join('..', 'website', 'static', 'data', 'emigration.csv'), index=False)
immigration_df.to_csv(os.path.join('..', 'website', 'static', 'data', 'immigration.csv'), index=False)