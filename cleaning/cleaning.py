import os
import pandas as pd

years = ['2011', '2012', '2013', '2014', '2015', '2016', '2017']
base_file = 'state-to-state_migration_'

final_df = pd.DataFrame(data={'target': [], 'source': [], 'flow': [], 'year': []})

for year in years:
    file_path = base_file + year + '.csv'
    data_path = os.path.join('..', 'website', 'static', 'data', file_path)

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

    year_list = [year]*(len(target))
                        
    temp = pd.DataFrame(data={'target': target, 'source': source, 'flow': flow, 'year': year_list}).dropna()
    final_df = final_df.append(temp)

final_df['flow'] = final_df['flow'].map(int)
output_path = os.path.join('..', 'website', 'static', 'data', 'aggregate.csv')
final_df.sort_values('year').to_csv(output_path, index=False)