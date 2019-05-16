import os
import pandas as pd

years = ['2015', '2016', '2017']
base_file = 'state-to-state_migration_'
output_file = [os.path.join('..', 'data', base_file + year + '_fixed.csv') for year in years]

for (year, path) in zip(years, output_file):
    file_path = base_file + year + '.csv'
    data_path = os.path.join('..', 'data', file_path)

    year_df = pd.read_csv(data_path)
    target = []
    source = []
    flow = []
    states = year_df.iloc[0].index
    
    for i in range(1, 52):
        for j in range(1, 52):
            temp = year_df.iloc[i].iloc[j]
            if isinstance(temp, str):
                if(states[j] != 'Total'):
                    source.append(states[j])
                    target.append(states[i])
                    flow.append(int(temp.replace(',', '')))
                        
    pd.DataFrame(data={'target': target, 'source': source, 'flow': flow}).dropna().to_csv(path, index=False)